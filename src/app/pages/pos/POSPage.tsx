import React, { useState, useMemo } from 'react';
import { useMenu } from '../../../hooks/useMenu';
import { usePOSCommands } from '../../../hooks/usePOSCommands';
import { useTables } from '../../../hooks/useTables';

// Components UI
import { ProductGrid } from './ProductGrid';
import CartSidebar from './CartSidebar';
import { CategoryTabs } from './CategoryTabs';
import { ProductDetailModal } from './ProductDetailModal';
import { OrderTypeModal } from './OrderTypeModal';
import { ComboSelectionModal } from './ComboSelectionModal';

// Models
import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition'; // <--- IMPORTANTE
import type { OrderItem } from '../../../models/OrderItem';
import type { OrderType } from '../../../models/Order';

const POSPage: React.FC = () => {
  const { categories, products, combos, loading: menuLoading } = useMenu();
  const { tables } = useTables();
  const { cart, commands, isSubmitting } = usePOSCommands();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  
  // Estado tipado correctamente como DEFINICIÓN, no instancia
  const [selectedCombo, setSelectedCombo] = useState<ComboDefinition | null>(null); 
  
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);

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

  const filteredCombos = useMemo(() => {
    if (searchQuery) {
       const lowerQ = searchQuery.toLowerCase();
       return combos.filter(c => c.name.toLowerCase().includes(lowerQ));
    }
    if (!selectedCategory || selectedCategory === 'combos') {
        return combos;
    }
    return [];
  }, [selectedCategory, combos, searchQuery]);

  if (menuLoading) return <div className="p-10 text-center">Cargando menú...</div>;

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col h-full overflow-hidden relative mr-80">
        <header className="bg-white p-4 shadow-sm z-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Pizza Brava</h1>
            <input
              type="text"
              placeholder="Buscar..."
              className="px-4 py-2 border rounded-lg w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CategoryTabs 
            categories={categories}
            active={selectedCategory}
            onChange={setSelectedCategory}
          />
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <ProductGrid 
            products={filteredProducts}
            combos={filteredCombos}
            onProductClick={(prod: MenuItem) => {
              if (prod.usesIngredients || prod.usesFlavors || prod.usesSizeVariant) {
                setSelectedProduct(prod);
              } else {
                commands.addProductToCart(prod);
              }
            }}
            // Ahora el callback recibe una Definición
            onComboClick={(combo: ComboDefinition) => setSelectedCombo(combo)} 
          />
        </main>
      </div>

      <CartSidebar 
        cart={cart}
        onIncrease={commands.increaseQuantity}
        onDecrease={commands.decreaseQuantity}
        onRemove={commands.removeItem}
        onClear={commands.clearOrder}
        onProcess={() => setIsOrderTypeModalOpen(true)}
      />

      {/* MODALES */}
      
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={(productWithOpts: MenuItem) => {
             commands.addProductToCart(productWithOpts); 
             setSelectedProduct(null);
          }}
        />
      )}

      {selectedCombo && (
        <ComboSelectionModal
          combo={selectedCombo} // Ahora los tipos coinciden (ComboDefinition)
          isOpen={!!selectedCombo}
          onClose={() => setSelectedCombo(null)}
          onConfirm={(comboItem: OrderItem) => {
            commands.addComboToCart(comboItem);
            setSelectedCombo(null);
          }}
        />
      )}

      <OrderTypeModal 
        isOpen={isOrderTypeModalOpen}
        onClose={() => setIsOrderTypeModalOpen(false)}
        isLoading={isSubmitting}
        tables={tables}
        onConfirm={async (type: OrderType, meta: any) => {
          await commands.submitOrder(type, meta);
          if (cart.length === 0) setIsOrderTypeModalOpen(false); 
        }}
      />
    </div>
  );
};

export default POSPage;