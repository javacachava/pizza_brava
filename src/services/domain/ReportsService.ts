import type { IOrderRepository } from '../../repos/interfaces/IOrderRepository';

export class ReportsService {
  private orders: IOrderRepository;

  constructor(orders: IOrderRepository) {
    this.orders = orders;
  }

  async getDashboardStats(range: 'day' | 'week' | 'month') {
    return this.orders.getSummary(range);
  }
}
