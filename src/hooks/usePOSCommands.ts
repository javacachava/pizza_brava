// src/hooks/usePOSCommands.tsx
import { useCallback } from 'react';
import { usePOSContext } from '../contexts/POSContext';
import type { MenuItem } from '../models/MenuItem';
import type { OrderItem } from '../models/OrderItem';
import { toast } from 'react-hot-toast';

/**
 * usePOSCommands - capa de Application (Command Pattern)
 * La UI solo consume estos comandos: increase, decrease, remove, add, addCombo.
 */
export const usePOSCommands = () => {
  const pos = usePOSContext();

  const increase = useCallback((index: number) => {
    if (typeof pos.updateQuantity === 'function') {
      pos.updateQuantity(index, 1);
      return;
    }
    // Fallback: intentar incrementar a través del setCart
    const item = pos.cart[index];
    if (!item) return;
    pos.addOrderItem({
      ...item,
      quantity: item.quantity + 1,
      totalPrice: Number((item.unitPrice * (item.quantity + 1)).toFixed(2))
    });
  }, [pos]);

  const decrease = useCallback((index: number) => {
    const item = pos.cart[index];
    if (!item) return;

    if (item.quantity > 1) {
      if (typeof pos.updateQuantity === 'function') {
        pos.updateQuantity(index, -1);
      } else {
        // fallback: set quantity via addOrderItem + remove (less ideal)
        pos.addOrderItem({
          ...item,
          quantity: item.quantity - 1,
          totalPrice: Number((item.unitPrice * (item.quantity - 1)).toFixed(2))
        });
        pos.removeIndex(index + 1);
      }
      return;
    }

    // si quantity === 1, remover
    pos.removeIndex(index);
  }, [pos]);

  const remove = useCallback((index: number) => {
    pos.removeIndex(index);
  }, [pos]);

  const add = useCallback((product: MenuItem, qty = 1, extras = 0) => {
    // prefer usePOS.addProduct (mantiene compatibilidad con posService)
    pos.addProduct(product, qty, extras);
    toast?.success?.(`${product.name} agregado`);
  }, [pos]);

  const addCombo = useCallback((item: OrderItem) => {
    pos.addOrderItem(item);
    toast?.success?.(`${item.productName} agregado`);
  }, [pos]);

  return {
    cart: pos.cart,
    commands: {
      increase,
      decrease,
      remove,
      add,
      addCombo
    }
  };
};
