import { useState } from 'react';
import { container } from '../models/di/container';
import type { MenuItem } from '../models/MenuItem';
import type { OrderItem } from '../models/OrderItem';

export function usePOS() {
  const posService = container.posService;

  const [cart, setCart] = useState<OrderItem[]>([]);

  const addProduct = (product: MenuItem, quantity: number = 1, extras: number = 0) => {
    setCart(prev => posService.addProduct(prev, product, quantity, extras));
  };

  /**
   * NUEVO: Agregar un OrderItem completo
   */
  const addOrderItem = (item: OrderItem) => {
    setCart(prev => posService.addOrderItem(prev, item));
  };

  const removeIndex = (index: number) => {
    setCart(prev => posService.removeIndex(prev, index));
  };

  const clear = () => {
    setCart(posService.clear());
  };

  return {
    cart,
    addProduct,
    addOrderItem, // <── AHORA PÚBLICO
    removeIndex,
    clear,
  };
}
