import type { OrderItem } from '../../models/OrderItem';

export const cartService = {
  /**
   * Recalcula el precio total de un item basado en su cantidad.
   */
  recalculateItemTotal(item: OrderItem): OrderItem {
    const newItem = { ...item };
    // Asumimos que unitPrice es el precio final unitario (base + extras)
    newItem.totalPrice = newItem.unitPrice * newItem.quantity;
    return newItem;
  },

  /**
   * Actualiza la cantidad de un producto en el carrito de forma inmutable.
   */
  updateQuantity(cart: OrderItem[], index: number, delta: number): OrderItem[] {
    if (index < 0 || index >= cart.length) return cart;

    const newCart = [...cart];
    const item = { ...newCart[index] };
    
    const newQuantity = item.quantity + delta;

    // Regla de negocio: La cantidad mínima es 1.
    // Para eliminar, se debe usar la función remove explícita.
    if (newQuantity < 1) return cart;

    item.quantity = newQuantity;
    const updatedItem = this.recalculateItemTotal(item);
    
    newCart[index] = updatedItem;
    return newCart;
  },

  /**
   * Calcula el total de la orden.
   */
  calculateOrderTotal(cart: OrderItem[]): number {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  }
};