import { OrdersRepository } from '../../repos/OrdersRepository';
import { RulesRepository } from '../../repos/RulesRepository';
import { MenuRepository } from '../../repos/MenuRepository';
import { TablesRepository } from '../../repos/TablesRepository';

import { ComboService } from './ComboService';

import type { Order, OrderType } from '../../models/Order';
import type { OrderItem } from '../../models/OrderItem';
import type { Table } from '../../models/Table';

export class POSService {
    private ordersRepo: OrdersRepository;
    private rulesRepo: RulesRepository;
    private menuRepo: MenuRepository;
    private tablesRepo: TablesRepository;
    private comboService: ComboService;

    constructor() {
        this.ordersRepo = new OrdersRepository();
        this.rulesRepo = new RulesRepository();
        this.menuRepo = new MenuRepository();
        this.tablesRepo = new TablesRepository();
        this.comboService = new ComboService();
    }

    async createOrder(
        items: OrderItem[],
        customerName: string,
        type: OrderType,
        userId: string,
        tableNumber?: string
    ): Promise<string> {
        if (items.length === 0) {
            throw new Error("La orden no puede estar vacía");
        }

        const rules = await this.rulesRepo.getByKey('taxRate');
        const taxRate = (rules?.value as number) || 0;

        let calculatedSubtotal = 0;

        for (const item of items) {
            const product = await this.menuRepo.getById(item.productId);
            if (!product) {
                throw new Error(`Producto no encontrado: ${item.productName}`);
            }

            const safeUnitPrice = product.price;
            const lineTotal = safeUnitPrice * item.quantity;
            calculatedSubtotal += lineTotal;
        }

        const tax = calculatedSubtotal * taxRate;
        const total = calculatedSubtotal + tax;

        const newOrderData: Omit<Order, 'id' | 'orderNumber'> = {
            customerName,
            items: items.map(i => ({ ...i })),
            subtotal: calculatedSubtotal,
            tax,
            total,
            status: 'pending',
            type,
            createdAt: new Date(),
            createdBy: userId,
            tableNumber: type === 'dine-in' ? tableNumber : undefined
        };

        return await this.ordersRepo.createTransactional(newOrderData);
    }

    async addComboToOrder(
        selections: { slotId: string; productId: string; quantity: number }[],
        comboId: string,
        orderQuantity = 1
    ): Promise<OrderItem> {
        const valid = await this.comboService.validateCombo(comboId, selections);
        if (!valid.valid) {
            throw new Error('Validación de combo: ' + valid.errors.join('; '));
        }

        const comboOrderItem = await this.comboService.buildOrderItemFromCombo(
            comboId,
            selections,
            orderQuantity
        );

        return comboOrderItem as OrderItem;
    }

    async getTables(): Promise<Table[]> {
        return await this.tablesRepo.getActiveTables();
    }
}
