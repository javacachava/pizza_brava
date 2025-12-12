// src/app/pages/pos/POSPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useMenuContext } from '../../../contexts/MenuContext';
import { usePOSContext } from '../../../contexts/POSContext';
import { useOrderContext } from '../../../contexts/providers/OrderProvider';
import { container } from '../../../models/di/container';

import { ProductGrid } from './ProductGrid';
import { ProductDetailModal } from './ProductDetailModal';
import { CategoryTabs } from './CategoryTabs';
import CartSidebar from './CartSidebar';
import { ComboSelectionModal } from './ComboSelectionModal';
import { OrderTypeModal } from './OrderTypeModal';

import { usePOSCommands } from '../../../hooks/usePOSCommands';

import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition';
import type { OrderItem } from '../../../models/OrderItem';
import type { OrderType } from '../../../models/Order';

import { formatPrice } from '../../../utils/format';
import { calculateCartTotal } from '../../../utils/pos';
import { generateSafeId } from '../../../utils/id';

export const POSPage: React.FC = () => {
  const {
    items: menuItems,
    categories,
    loading: menuLoading,
    refresh: refreshMenu
  } = useMenuContext();

  const {
    cart,
    addProduct,
    addOrderItem,
    updateQuantity,
    removeIndex,
    clear
  } = usePOSContext();

  const { createOrder, refresh: refreshOrders } = useOrderContext();

  const { cart: commandsCart, commands } = usePOSCommands();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isProductModalOpen, setProductModalOpen] = useState(false);

  const [comboDefinitions, setComboDefinitions] = useState<ComboDefinition[]>([]);
  const [selectedComboDef, setSelectedComboDef] = useState<ComboDefinition | null>(null);
  const [isComboModalOpen, setComboModalOpen] = useState(false);

  const [isOrderTypeOpen, setOrderTypeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar definiciones de combo
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const defs = await container.comboService.getDefinitions();
        if (mounted) setComboDefinitions(defs);
      } catch (err) {
        console.error('Error cargando definiciones de combo', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Productos filtrados
  const displayed: MenuItem[] = useMemo(() => {
    if (!activeCategory) return menuItems;
    return menuItems.filter((i: MenuItem) => i.categoryId === activeCategory);
  }, [menuItems, activeCategory]);

  const handleProductClick = (p: MenuItem) => {
    setSelectedProduct(p);
    setProductModalOpen(true);
  };

  const handleAddProduct = (qty: number) => {
    if (!selectedProduct) return;
    commands.add(selectedProduct, qty, 0);
    setProductModalOpen(false);
  };

  const handleConfirmCombo = (selections: Record<string, string[]>) => {
    if (!selectedComboDef) return;

    const comboInstance = container.comboService.generateCombo(
      selectedComboDef,
      selections
    );

    const comboOrderItem: OrderItem = {
      productId: comboInstance.id,
      productName: comboInstance.name + ' (Combo)',
      quantity: 1,
      unitPrice: comboInstance.price,
      totalPrice: comboInstance.price,
      isCombo: true,
      combo: comboInstance,
      selectedOptions: [],
      comment: ''
    };

    commands.addCombo(comboOrderItem);

    setComboModalOpen(false);
    setSelectedComboDef(null);
  };

  const handleOpenOrderType = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    setOrderTypeOpen(true);
  };

  const handleSubmitOrder = async (type: OrderType) => {
    setSubmitting(true);
    try {
      const items = cart.map((ci: OrderItem) => ({
        productId: ci.productId ?? generateSafeId(),
        productName: ci.productName,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        totalPrice: ci.totalPrice,
        comment: ci.comment,
        selectedOptions: ci.selectedOptions,
        isCombo: ci.isCombo ?? false,
        combo: ci.combo ?? null
      }));

      const total = calculateCartTotal(items);

      const orderPayload = {
        id: generateSafeId(),
        items,
        total,
        orderType: type,
        status: 'pending',
        createdAt: Date.now()
      };

      await createOrder(orderPayload);
      clear();
      setOrderTypeOpen(false);
      alert('Orden creada correctamente');
      refreshOrders();
    } catch (err) {
      console.error(err);
      alert('Error creando orden');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <main className="flex-1 p-6 mr-80"> {/* mr-80 para dejar espacio al sidebar fijo */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Punto de Venta</h1>
            <p className="text-sm text-gray-600">Selecciona productos para comenzar la orden</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600">Items: {cart.length}</div>
            <div className="text-lg font-semibold">
              {formatPrice(cart.reduce((acc, it) => acc + (it.totalPrice ?? 0), 0))}
            </div>
          </div>
        </div>

        <CategoryTabs
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="mt-4">
          <div className="flex justify-end gap-2 mb-2">
            <select
              value={activeCategory ?? ''}
              onChange={e => setActiveCategory(e.target.value || null)}
              className="input-field"
            >
              <option value="">Filtrar por categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <button className="px-3 py-2 border rounded" onClick={() => refreshMenu()}>
              Actualizar menú
            </button>
          </div>

          <ProductGrid
            products={displayed}
            onProductClick={handleProductClick}
          />
        </div>
      </main>

      <CartSidebar
        cart={cart}
        onIncrease={commands.increase}
        onDecrease={commands.decrease}
        onRemove={commands.remove}
        onSubmitOrder={handleOpenOrderType}
      />

      {isProductModalOpen && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => { setProductModalOpen(false); setSelectedProduct(null); }}
          onAdd={handleAddProduct}
        />
      )}

      {isComboModalOpen && selectedComboDef && (
        <ComboSelectionModal
          definition={selectedComboDef}
          menu={menuItems.reduce<Record<string, string>>(
            (acc, mi: MenuItem) => {
              acc[mi.id] = mi.name;
              return acc;
            },
            {}
          )}
          onClose={() => { setComboModalOpen(false); setSelectedComboDef(null); }}
          onConfirm={handleConfirmCombo}
        />
      )}

      {isOrderTypeOpen && (
        <OrderTypeModal
          open={isOrderTypeOpen}
          onClose={() => setOrderTypeOpen(false)}
          onSelect={(t: OrderType) => handleSubmitOrder(t)}
        />
      )}

      <div style={{ position: 'fixed', bottom: 16, left: 16 }}>
        {comboDefinitions.map((cd: ComboDefinition) => (
          <button
            key={cd.id}
            onClick={() => {
              setSelectedComboDef(cd);
              setComboModalOpen(true);
            }}
            className="mr-2 px-3 py-2 bg-gray-100 rounded"
          >
            Combo: {cd.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default POSPage;
