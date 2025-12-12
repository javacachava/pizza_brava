import React, { useState, useMemo } from 'react';
import { useMenu } from '../../../hooks/useMenu';
import { usePOSCommands } from '../../../hooks/usePOSCommands';
import { useTables } from '../../../hooks/useTables';

// Components UI
import ProductGrid from './ProductGrid';
import CartSidebar from './CartSidebar';
import CategoryTabs from './CategoryTabs';
import ProductDetailModal from './ProductDetailModal';
import OrderTypeModal from './OrderTypeModal';
import ComboSelectionModal from './ComboSelectionModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // Asumiendo existencia o usar uno simple

// Models
import type { MenuItem } from '../../../models/MenuItem';
import type { Combo } from '../../../models/Combo';

/**
 * POSPage
 * Componente de UI Principal ("View").
 * Responsabilidad: Renderizar el estado y capturar eventos del usuario.
 * NO contiene lógica de negocio (cálculos, validaciones, manipulaciones de array).
 */
const POSPage: React.FC = () => {
  // 1. Hooks de Infraestructura (Datos)
  const { categories, products, combos, loading: menuLoading } = useMenu();
  const { tables } = useTables();
  
  // 2. Hook de Aplicación (Lógica y Comandos)
  const { cart, commands, isSubmitting } = usePOSCommands();

  // 3. Estado Local (Solo para UI: Modales y Tabs)
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modales
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);

  // --- Filtrado de Productos (UI Logic) ---
  const filteredItems = useMemo(() => {
    let items = selectedCategory === 'todos' 
      ? products 
      : products.filter(p => p.categoryId === selectedCategory);

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(lowerQ));
    }
    return items;
  }, [selectedCategory, products, searchQuery]);

  // --- Filtrado de Combos (UI Logic) ---
  const filteredCombos = useMemo(() => {
    if (selectedCategory !== 'combos' && selectedCategory !== 'todos') return [];
    // Asumiendo que los combos se muestran cuando la categoría es 'combos' o 'todos'
    // O si tienes una categoría específica en bootstrap.json llamada 'combos'
    return combos; 
  }, [selectedCategory, combos]);


  if (menuLoading) return <div className="flex h-screen items-center justify-center"><p>Cargando menú...</p></div>;

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA: MENÚ Y PRODUCTOS */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header / Buscador */}
        <header className="bg-white p-4 shadow-sm z-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Pizza Brava POS</h1>
            <input
              type="text"
              placeholder="Buscar producto..."
              className="px-4 py-2 border rounded-lg w-1/3 focus:ring-2 focus:ring-orange-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Categorías */}
          <CategoryTabs 
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </header>

        {/* Grid de Productos */}
        <main className="flex-1 overflow-y-auto p-4">
          <ProductGrid 
            products={filteredItems}
            combos={selectedCategory === 'combos' || selectedCategory === 'todos' ? filteredCombos : []}
            onProductClick={(prod) => {
              if (prod.usesIngredients || prod.usesFlavors || prod.usesSizeVariant) {
                // Si requiere configuración, abrir modal
                setSelectedProduct(prod);
              } else {
                // Si es simple, agregar directo (Fast POS)
                commands.addProductToCart(prod);
              }
            }}
            onComboClick={(combo) => setSelectedCombo(combo)}
          />
        </main>
      </div>

      {/* SECCIÓN DERECHA: SIDEBAR CARRITO */}
      <CartSidebar 
        cart={cart}
        onIncrease={commands.increaseQuantity}
        onDecrease={commands.decreaseQuantity}
        onRemove={commands.removeItem}
        onClear={commands.clearOrder}
        onProcess={() => setIsOrderTypeModalOpen(true)}
      />

      {/* --- MODALES --- */}

      {/* 1. Detalle de Producto (Ingredientes/Sabores) */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={(product, quantity, extras) => { // Ajustar firma según tu componente real
             // Aquí asumimos que el modal devuelve el producto base o configurado
             // Si tu modal maneja lógica compleja, idealmente debería devolver un objeto listo para commands.addOrderItem
             // Por simplicidad en este ejemplo, llamamos al addProduct simple
             commands.addProductToCart(product); 
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

      {/* 3. Tipo de Orden y Envío */}
      <OrderTypeModal 
        isOpen={isOrderTypeModalOpen}
        onClose={() => setIsOrderTypeModalOpen(false)}
        isLoading={isSubmitting}
        tables={tables} // Pasamos mesas para el select
        onConfirm={(type, meta) => {
          commands.submitOrder(type, meta);
          // El cierre del modal y limpieza ocurre en submitOrder tras éxito
          if (!isSubmitting) setIsOrderTypeModalOpen(false); 
        }}
      />
    </div>
  );
};

export default POSPage;