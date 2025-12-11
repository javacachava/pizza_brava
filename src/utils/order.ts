import type { Order } from '../models/Order';
import type { OrderItem } from '../models/OrderItem';
import { sumPrices } from './price';

export function calculateOrderTotal(items: OrderItem[]): number {
  return sumPrices(...items.map(i => i.totalPrice));
}

export const ORDER_STATES = {
  pending: 'Pendiente',
  preparing: 'Preparando',
  ready: 'Listo',
};

export function normalizeOrder(order: Order): Order {
  return {
    ...order,
    total: calculateOrderTotal(order.items || []),
    status: order.status || 'pending'
  };
}
