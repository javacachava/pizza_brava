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
  // Obtenemos flavors del hook useMenu actualizado
  const { categories, products, combos, flavors, loading: menuLoading } = useMenu();
  const { tables } = useTables();
  const { cart, commands, isSubmitting } = usePOSCommands();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<ComboDefinition | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!menuLoading && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, menuLoading, selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return products.filter(p => p.name.toLowerCase().includes(q));
    }
    if (!selectedCategory) return [];
    return products.filter(p => p.categoryId === selectedCategory);
  }, [selectedCategory, products, searchQuery]);

  const filteredCombos = useMemo(() => {
    if (searchQuery) {
       const q = searchQuery.toLowerCase();
       return combos.filter(c => c.name.toLowerCase().includes(q));
    }
    if (selectedCategory === 'combos') {
        return combos;
    }
    return [];
  }, [selectedCategory, combos, searchQuery]);

  if (menuLoading) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      <div className="flex-1 flex flex-col h-full overflow-hidden relative mr-80">
        <header className="bg-white px-6 pt-4 pb-2 shadow-sm z-10 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4 gap-4">
            <h1 className="text-2xl font-black text-gray-800 hidden lg:block">Pizza Brava</h1>
            <div className="relative flex-1 max-w-lg">
              <input
                className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CategoryTabs categories={categories} active={selectedCategory} onChange={setSelectedCategory} />
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <ProductGrid 
            products={filteredProducts}
            combos={filteredCombos}
            onProductClick={(prod) => {
              // Ahora Frozen entra aquí porque usesFlavors=true
              if (prod.usesIngredients || prod.usesFlavors || prod.usesSizeVariant) {
                setSelectedProduct(prod);
              } else {
                commands.addProductToCart(prod);
              }
            }}
            onComboClick={setSelectedCombo}
          />
        </main>
      </div>

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
          allFlavors={flavors} // <--- Pasamos los sabores cargados
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={(product, qty, notes, options) => {
             // Pasamos options (sabor seleccionado) al comando
             commands.addProductToCart(product, qty, notes, options);
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