import type { MenuItem } from '../../models/MenuItem';
import type { OrderItem } from '../../models/OrderItem';
import { normalizeItem } from '../../utils/pos';

export class POSService {
  /**
   * Agregar un producto normal desde MenuItem
   */
  addProduct(
    cart: OrderItem[],
    product: MenuItem,
    quantity: number = 1,
    extras: number = 0
  ): OrderItem[] {
    const orderItem = normalizeItem(product, quantity, extras);
    return [...cart, orderItem];
  }

  /**
   * Agregar un OrderItem COMPLETO,
   * usado para combos, items personalizados o importados.
   */
  addOrderItem(cart: OrderItem[], item: OrderItem): OrderItem[] {
    return [...cart, item];
  }

  /**
   * Remover un item por índice
   */
  removeIndex(cart: OrderItem[], index: number): OrderItem[] {
    return cart.filter((_, i) => i !== index);
  }

  /**
   * Vaciar carrito
   */
  clear(): OrderItem[] {
    return [];
  }
}
