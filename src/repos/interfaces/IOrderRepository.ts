import type { Order } from '../../models/Order';

export interface IOrderRepository {
  getById(id: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
  update(id: string, partial: Partial<Order>): Promise<void>;
  delete(id: string): Promise<void>;
  getActiveOrders(): Promise<Order[]>;
  getByStatus(statuses: string[]): Promise<Order[]>;
  getSummary(range: 'day' | 'week' | 'month'): Promise<any>;
}
