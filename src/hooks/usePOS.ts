// src/hooks/usePOS.ts
import { useState } from 'react';
import { container } from '../models/di/container';
import type { MenuItem } from '../models/MenuItem';
import type { OrderItem } from '../models/OrderItem';
import { cartService } from '../services/domain/cartService';

export function usePOS() {
  const posService = container.posService; // tu servicio de dominio/infrastructure existente

  const [cart, setCart] = useState<OrderItem[]>([]);

  const addProduct = (product: MenuItem, quantity: number = 1, extras: number = 0) => {
    // Delegamos a posService si tiene lógica de persistencia o a cartService si no.
    if (posService && typeof posService.addProduct === 'function') {
      setCart(prev => posService.addProduct(prev, product, quantity, extras));
      return;
    }
    setCart(prev => cartService.addOrIncrement(prev, product, quantity, extras));
  };

  const addOrderItem = (item: OrderItem) => {
    if (posService && typeof posService.addOrderItem === 'function') {
      setCart(prev => posService.addOrderItem(prev, item));
      return;
    }
    setCart(prev => [...prev, item]);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => cartService.updateQuantity(prev, index, delta));
  };

  const setItemQuantity = (index: number, newQty: number) => {
    setCart(prev => cartService.setQuantity(prev, index, newQty));
  };

  const removeIndex = (index: number) => {
    if (posService && typeof posService.removeIndex === 'function') {
      setCart(prev => posService.removeIndex(prev, index));
      return;
    }
    setCart(prev => cartService.removeAt(prev, index));
  };

  const clear = () => {
    if (posService && typeof posService.clear === 'function') {
      setCart(prev => posService.clear());
      return;
    }
    setCart([]);
  };

  return {
    cart,
    setCart, // expuesto para cases controlados (Commands puede usarlo)
    addProduct,
    addOrderItem,
    updateQuantity,
    setItemQuantity,
    removeIndex,
    clear
  };
}
