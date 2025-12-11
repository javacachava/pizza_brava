import type { MenuItem } from '../models/MenuItem';
import type { OrderItem } from '../models/OrderItem';
import { calculateOrderTotal } from './order';

export function normalizeItem(
  product: MenuItem,
  quantity = 1,
  extras = 0
): OrderItem {
  const unitPrice = product.price + extras;

  return {
    productId: product.id,
    productName: product.name,
    quantity,
    unitPrice,
    totalPrice: unitPrice * quantity,
    isCombo: false
  };
}

export function calculateCartTotal(cart: OrderItem[]) {
  return calculateOrderTotal(cart);
}
