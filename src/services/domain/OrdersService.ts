import type { IOrderRepository } from '../../repos/interfaces/IOrderRepository';
import type { Order, OrderStatus } from '../../models/Order';
import type { OrderItem } from '../../models/OrderItem';

export class OrdersService {
  private orders: IOrderRepository;

  constructor(orders: IOrderRepository) {
    this.orders = orders;
  }

  async createOrder(order: Order): Promise<Order> {
    if (!order.items.length) throw new Error('La orden está vacía');
    return this.orders.create(order);
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.orders.update(id, { status });
  }

  async addItem(id: string, item: OrderItem) {
    const order = await this.orders.getById(id);
    if (!order) throw new Error('Orden no encontrada');

    order.items.push(item);
    order.total = order.items.reduce((sum, i) => sum + i.totalPrice, 0);

    return this.orders.update(id, order);
  }

  async getActiveOrders(): Promise<Order[]> {
    return this.orders.getActiveOrders();
  }
}
