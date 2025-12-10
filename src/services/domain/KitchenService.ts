import { OrdersRepository } from '../../repos/OrdersRepository';
import type { Order, OrderStatus } from '../../models/Order';

export class KitchenService {
    private ordersRepo: OrdersRepository;

    constructor() {
        this.ordersRepo = new OrdersRepository();
    }

    subscribeToOrders(onUpdate: (orders: Order[]) => void): () => void {
        return this.ordersRepo.subscribeToActiveOrders(onUpdate);
    }

    async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
        await this.ordersRepo.updateStatus(orderId, status);
    }
}