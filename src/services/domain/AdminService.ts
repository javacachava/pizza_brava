import { CashFlowRepository } from "../../repos/CashFlowRepository";
import { OrdersRepository } from "../../repos/OrdersRepository";
import type { CashCut, Expense, ExpenseCategory } from "../../models/CashFlow";

export class AdminService {
    private cashRepo = new CashFlowRepository();
    private ordersRepo = new OrdersRepository();

    // Obtener categorías para el dropdown de "Retiro de Dinero"
    async getExpenseCategories(): Promise<ExpenseCategory[]> {
        return await this.cashRepo.getExpenseCategories();
    }

    // Calcular totales del día (Ventas reales desde Pedidos)
    async getDailyTotals(date: Date) {
        // Aquí conectamos con OrdersRepository para sumar ventas del día
        // Nota: Asegúrate que OrdersRepository tenga un método getOrdersByDate o similar
        // Por ahora simulamos la suma lógica o implementamos getDailySales() en OrdersRepo
        return {
            totalSales: 0, // Implementar lógica real de suma
            orderCount: 0
        };
    }

    async closeDay(cut: CashCut): Promise<string> {
        return await this.cashRepo.saveCashCut(cut);
    }
}