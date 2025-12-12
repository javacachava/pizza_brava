import type { OrderItem } from '../../models/OrderItem';
import type { MenuItem } from '../../models/MenuItem';

export const cartService = {
  recalculateItemTotal(item: OrderItem): OrderItem {
    const newItem = { ...item };
    newItem.totalPrice = Number((newItem.unitPrice * newItem.quantity).toFixed(2));
    return newItem;
  },

  updateQuantity(cart: OrderItem[], index: number, delta: number): OrderItem[] {
    if (index < 0 || index >= cart.length) return cart;

    const newCart = [...cart];
    const item = { ...newCart[index] };
    const newQuantity = item.quantity + delta;

    // Si la regla de negocio define eliminar con cantidad menor a 1,
    // esta función no elimina: retorna el cart original para evitar borrados implícitos.
    if (newQuantity < 1) return cart;

    item.quantity = newQuantity;
    newCart[index] = this.recalculateItemTotal(item);
    return newCart;
  },

  setQuantity(cart: OrderItem[], index: number, newQty: number): OrderItem[] {
    if (index < 0 || index >= cart.length) return cart;
    if (newQty < 1) return cart;

    const newCart = [...cart];
    const item = { ...newCart[index] };
    item.quantity = newQty;
    newCart[index] = this.recalculateItemTotal(item);
    return newCart;
  },

  removeAt(cart: OrderItem[], index: number): OrderItem[] {
    if (index < 0 || index >= cart.length) return cart;
    const newCart = [...cart];
    newCart.splice(index, 1);
    return newCart;
  },

  removeByProductId(cart: OrderItem[], productId: string): OrderItem[] {
    return cart.filter(ci => ci.productId !== productId);
  },

  addOrIncrement(cart: OrderItem[], product: MenuItem, qty = 1, extras = 0) {
    // Busca coincidencia en productos normales (no combos)
    const idx = cart.findIndex(ci => ci.productId === product.id && !ci.isCombo);
    const copy = [...cart];

    if (idx >= 0) {
      const item = { ...copy[idx] };
      item.quantity = item.quantity + qty;
      item.totalPrice = Number((item.unitPrice * item.quantity).toFixed(2));
      copy[idx] = item;
    } else {
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitPrice: product.price,
        totalPrice: Number((product.price * qty).toFixed(2)),
        isCombo: false,
        selectedOptions: [],
        comment: ''
      };
      copy.push(newItem);
    }

    return copy;
  },

  calculateOrderTotal(cart: OrderItem[]): number {
    return Number(cart.reduce((acc, it) => acc + (it.totalPrice ?? 0), 0).toFixed(2));
  }
};

export default cartService;
