// Categoría de gasto (viene de expenseCategories)
export interface ExpenseCategory {
    id: string;
    name: string;
}

// Registro de un gasto individual
export interface Expense {
    id?: string;
    categoryId: string;
    categoryName: string;
    amount: number;
    description: string;
    date: Date;
    userId: string; // Quién registró el gasto
}

// El Corte de Caja (Cierre del día)
export interface CashCut {
    id?: string;
    openedAt: Date;
    closedAt: Date;
    initialAmount: number; // Fondo de caja inicial
    finalAmount: number;   // Efectivo contado al cierre
    declaredAmount: number; // Ventas en efectivo registradas por sistema
    difference: number;     // Sobrante o Faltante
    totalSales: number;     // Ventas totales (Tarjeta + Efectivo + Etc)
    totalExpenses: number;  // Total de gastos del día
    expenses: Expense[];    // Detalle de gastos
    closedBy: string;       // ID del usuario que cerró
}