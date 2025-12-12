import React, { useState, useMemo } from 'react';
import { useMenu } from '../../../hooks/useMenu';
import { usePOSCommands } from '../../../hooks/usePOSCommands';
import { useTables } from '../../../hooks/useTables';

// Components UI - Imports verificados con structure
import { ProductGrid } from './ProductGrid';
import CartSidebar from './CartSidebar'; // Ojo: CartSidebar suele ser default export
import { CategoryTabs } from './CategoryTabs';
import ProductDetailModal from './ProductDetailModal';
import OrderTypeModal from './OrderTypeModal';
import ComboSelectionModal from './ComboSelectionModal';

// Models
import type { MenuItem } from '../../../models/MenuItem';
import type { Combo } from '../../../models/Combo';

const POSPage: React.FC = () => {
  // 1. Hooks de Infraestructura (Data Fetching)
  // Ahora useMenu y useTables usan el container internamente si no se pasan args
  const { categories, products, combos, loading: menuLoading } = useMenu();
  const { tables } = useTables();
  
  // 2. Hook de Aplicación (Business Logic & Commands)
  const { cart, commands, isSubmitting } = usePOSCommands();

  // 3. Estado Local (UI State only)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // null = 'Todos'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modales
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);

  // --- Lógica de Filtrado (UI Logic) ---
  const filteredProducts = useMemo(() => {
    let items = selectedCategory
      ? products.filter(p => p.categoryId === selectedCategory)
      : products;

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(lowerQ));
    }
    return items;
  }, [selectedCategory, products, searchQuery]);

  // Filtramos combos si la categoría seleccionada es 'combos' o si no hay categoría (pantalla principal)
  // Nota: Esto asume que tienes una categoría con id 'combos' en tu BD o quieres mostrarlos en 'Todos'.
  const filteredCombos = useMemo(() => {
    // Si buscamos texto, buscar también en combos
    if (searchQuery) {
       const lowerQ = searchQuery.toLowerCase();
       return combos.filter(c => c.name.toLowerCase().includes(lowerQ));
    }
    
    // Lógica de visualización: Mostrar si categoria es null o 'combos'
    if (!selectedCategory || selectedCategory === 'combos') {
        return combos;
    }
    return [];
  }, [selectedCategory, combos, searchQuery]);


  if (menuLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="animate-pulse text-orange-600 font-semibold">Cargando sistema POS...</div>
        </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      
      {/* --- PANEL IZQUIERDO: CATÁLOGO --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative mr-80"> {/* mr-80 para espacio del sidebar fijo */}
        
        {/* Header Fijo */}
        <header className="bg-white px-6 py-4 shadow-sm z-10 border-b">
          <div className="flex justify-between items-center mb-4 gap-4">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight hidden md:block">
              Pizza<span className="text-orange-600">Brava</span>
            </h1>
            <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input
                type="text"
                placeholder="Buscar producto o combo..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-orange-500 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>
          
          {/* Tabs de Categorías */}
          <CategoryTabs 
            categories={categories}
            active={selectedCategory}
            onChange={setSelectedCategory}
          />
        </header>

        {/* Grid Scrollable */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <ProductGrid 
            products={filteredProducts}
            combos={filteredCombos}
            onProductClick={(prod) => {
              // Si el producto es configurable (ingredientes, sabores, tamaños), abrir modal
              if (prod.usesIngredients || prod.usesFlavors || prod.usesSizeVariant) {
                setSelectedProduct(prod);
              } else {
                // Si es simple, comando directo
                commands.addProductToCart(prod);
              }
            }}
            onComboClick={(combo) => setSelectedCombo(combo)}
          />
        </main>
      </div>

      {/* --- PANEL DERECHO: SIDEBAR CARRITO (Fixed) --- */}
      <CartSidebar 
        cart={cart}
        onIncrease={commands.increaseQuantity}
        onDecrease={commands.decreaseQuantity}
        onRemove={commands.removeItem}
        onClear={commands.clearOrder}
        onProcess={() => setIsOrderTypeModalOpen(true)}
      />

      {/* --- MODALES (Portals/Overlays) --- */}

      {/* 1. Configuración de Producto */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={(productWithOpts) => { 
             commands.addProductToCart(productWithOpts); 
             setSelectedProduct(null);
          }}
        />
      )}

      {/* 2. Constructor de Combos */}
      {selectedCombo && (
        <ComboSelectionModal
          combo={selectedCombo}
          isOpen={!!selectedCombo}
          onClose={() => setSelectedCombo(null)}
          onConfirm={(comboItem) => {
            commands.addComboToCart(comboItem);
            setSelectedCombo(null);
          }}
        />
      )}

      {/* 3. Checkout / Tipo de Orden */}
      <OrderTypeModal 
        isOpen={isOrderTypeModalOpen}
        onClose={() => setIsOrderTypeModalOpen(false)}
        isLoading={isSubmitting}
        tables={tables}
        onConfirm={async (type, meta) => {
          await commands.submitOrder(type, meta);
          // Si el comando fue exitoso (el carrito se vació), cerramos el modal
          if (cart.length === 0) setIsOrderTypeModalOpen(false); 
        }}
      />
    </div>
  );
};

export default POSPage;