import { useState } from 'react';
import { container } from '../models/di/container';
import type { MenuItem } from '../models/MenuItem';
import type { OrderItem } from '../models/OrderItem';
import { cartService } from '../services/domain/cartService';

export function usePOS() {
  // Estado local del carrito
  const [cart, setCart] = useState<OrderItem[]>([]);

  // Esta función SOLO se usa para compatibilidad legacy si algo la llama directo.
  // Idealmente todo debe entrar por addOrderItem ahora.
  const addProduct = (product: MenuItem, quantity: number = 1, extras: number = 0) => {
    const item = cartService.createItemFromProduct(product, quantity);
    setCart(prev => cartService.addItem(prev, item));
  };

  /**
   * Agrega un item al carrito usando la lógica de agrupación del dominio.
   * Si el item ya existe (mismo ID, mismas opciones), suma cantidad.
   * Si es diferente, agrega nueva fila.
   */
  const addOrderItem = (item: OrderItem) => {
    setCart(prev => cartService.addItem(prev, item));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => cartService.updateQuantity(prev, index, delta));
  };

  const removeIndex = (index: number) => {
    setCart(prev => cartService.removeItem(prev, index));
  };

  const clear = () => {
    setCart([]);
  };

  return {
    cart,
    addProduct,
    addOrderItem, // <--- Esta es la clave
    updateQuantity,
    removeIndex,
    clear,
  };
}