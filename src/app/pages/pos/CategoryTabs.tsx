import React, { useState, useMemo, useEffect } from 'react';
import { useMenu } from '../../../hooks/useMenu';
import { usePOSCommands } from '../../../hooks/usePOSCommands';
import { useTables } from '../../../hooks/useTables';

import { ProductGrid } from './ProductGrid';
import { CartSidebar } from './CartSidebar';
import { CategoryTabs } from './CategoryTabs';
import { ProductDetailModal } from './ProductDetailModal';
import { OrderTypeModal } from './OrderTypeModal';
import { ComboSelectionModal } from './ComboSelectionModal';

import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition';
import type { OrderType } from '../../../models/Order';

export const POSPage: React.FC = () => {
  const { categories, products, combos, loading: menuLoading } = useMenu();
  const { tables } = useTables();
  const { cart, commands, isSubmitting } = usePOSCommands();

  // Estado inicial vacío hasta que carguen las categorías
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<ComboDefinition | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // EFECTO: Seleccionar automáticamente la primera categoría al cargar
  useEffect(() => {
    if (!menuLoading && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, menuLoading, selectedCategory]);

  // --- Filtros Estrictos ---
  const filteredProducts = useMemo(() => {
    // Si hay búsqueda, buscamos en TODO el catálogo ignorando categoría
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return products.filter(p => p.name.toLowerCase().includes(q));
    }

    // Filtrado estricto por categoría seleccionada
    if (!selectedCategory) return [];
    return products.filter(p => p.categoryId === selectedCategory);
  }, [selectedCategory, products, searchQuery]);

  const filteredCombos = useMemo(() => {
    // Si hay búsqueda, buscamos en TODO
    if (searchQuery) {
       const q = searchQuery.toLowerCase();
       return combos.filter(c => c.name.toLowerCase().includes(q));
    }

    // Solo mostrar combos si la categoría seleccionada es explícitamente "combos"
    // (Asumiendo que en tu BD la categoría de combos tiene id 'combos')
    if (selectedCategory === 'combos') {
        return combos;
    }
    return [];
  }, [selectedCategory, combos, searchQuery]);

  if (menuLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Cargando Menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative mr-80">
        
        {/* Header */}
        <header className="bg-white px-6 pt-4 pb-2 shadow-sm z-10 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4 gap-4">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight hidden lg:block">
              Pizza<span className="text-orange-600">Brava</span>
            </h1>
            
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="🔍 Buscar producto..."
                className="w-full px-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-100 outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <CategoryTabs 
            categories={categories}
            active={selectedCategory}
            onChange={setSelectedCategory}
          />
        </header>

        {/* Grid de Productos */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50 scroll-smooth">
          {/* Feedback visual si la categoría está vacía */}
          {!searchQuery && filteredProducts.length === 0 && filteredCombos.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
              <span className="text-4xl mb-2">🍽️</span>
              <p>No hay productos en esta categoría</p>
            </div>
          )}

          <ProductGrid 
            products={filteredProducts}
            combos={filteredCombos}
            onProductClick={(prod) => {
              if (prod.usesIngredients || prod.usesFlavors || prod.usesSizeVariant) {
                setSelectedProduct(prod);
              } else {
                commands.addProductToCart(prod);
              }
            }}
            onComboClick={(combo) => setSelectedCombo(combo)}
          />
        </main>
      </div>

      {/* SECCIÓN DERECHA: SIDEBAR */}
      <CartSidebar 
        cart={cart}
        onIncrease={commands.increaseQuantity}
        onDecrease={commands.decreaseQuantity}
        onRemove={commands.removeItem}
        onClear={commands.clearOrder}
        onProcess={() => setIsCheckoutOpen(true)}
      />

      {/* --- MODALES --- */}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={(product, qty, notes) => {
             commands.addProductToCart(product, qty, notes);
             setSelectedProduct(null);
          }}
        />
      )}

      {selectedCombo && (
        <ComboSelectionModal
          combo={selectedCombo}
          isOpen={!!selectedCombo}
          onClose={() => setSelectedCombo(null)}
          onConfirm={(comboItem) => {
            commands.addComboToCart(comboItem);
            setSelectedCombo(null);
          }}
          products={products}
        />
      )}

      <OrderTypeModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        isLoading={isSubmitting}
        tables={tables}
        onConfirm={async (type, meta) => {
          await commands.submitOrder(type, meta);
          if (cart.length === 0) setIsCheckoutOpen(false);
        }}
      />
    </div>
  );
};