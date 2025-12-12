import { useState } from 'react';
import { container } from '../models/di/container';
import type { MenuItem } from '../models/MenuItem';
import type { OrderItem } from '../models/OrderItem';
import { cartService } from '../services/domain/cartService';

export function usePOS() {
  const posService = container.posService;
  const [cart, setCart] = useState<OrderItem[]>([]);

  // Mantiene la lógica original de posService para agregar productos complejos
  const addProduct = (product: MenuItem, quantity: number = 1, extras: number = 0) => {
    setCart(prev => posService.addProduct(prev, product, quantity, extras));
  };

  const addOrderItem = (item: OrderItem) => {
    setCart(prev => posService.addOrderItem(prev, item));
  };

  // NUEVO: Implementación de updateQuantity delegando al dominio
  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => cartService.updateQuantity(prev, index, delta));
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
    addOrderItem,
    updateQuantity, // Exportamos la nueva función
    removeIndex,
    clear,
  };
}