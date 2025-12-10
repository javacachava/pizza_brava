import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import type { ExpenseCategory, CashCut, Expense } from "../models/CashFlow";

export class CashFlowRepository {
    
    // Traer las categorías que subiste con el script (para el select del Admin)
    async getExpenseCategories(): Promise<ExpenseCategory[]> {
        const q = query(collection(db, "expenseCategories"), orderBy("name"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as ExpenseCategory));
    }

    // Registrar un gasto (Salida de dinero)
    async addExpense(expense: Expense): Promise<string> {
        const ref = await addDoc(collection(db, "expenses"), expense);
        return ref.id;
    }

    // Guardar el Corte de Caja Final
    async saveCashCut(cut: CashCut): Promise<string> {
        const ref = await addDoc(collection(db, "cashCuts"), cut);
        return ref.id;
    }
}