import type { IOrderRepository } from '../../repos/interfaces/IOrderRepository';
import type { Order } from '../../models/Order';

export class KitchenService {
  private orders: IOrderRepository;

  constructor(orders: IOrderRepository) {
    this.orders = orders;
  }

  async getPending(): Promise<Order[]> {
    return this.orders.getByStatus(['pendiente', 'preparando']);
  }

  async markPreparing(id: string) {
    return this.orders.update(id, { status: 'preparando' });
  }

  async markReady(id: string) {
    return this.orders.update(id, { status: 'listo' });
  }
}
