import { BaseRepository } from '../BaseRepository';
import type { CashFlow } from '../../models/CashFlow';
import type { ICashFlowRepository } from '../interfaces/ICashFlowRepository';
import { query, where, getDocs } from 'firebase/firestore';

export class CashFlowRepository extends BaseRepository<CashFlow> implements ICashFlowRepository {
  constructor() { super('cashFlow'); }

  async getAll(): Promise<CashFlow[]> { return super.getAll(); }

  async getDailySummary(): Promise<any> {
    const since = Date.now() - 24 * 3600 * 1000;
    const q = query(this.collRef, where('createdAt', '>=', since));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ ...(d.data() as CashFlow), id: d.id }));
    const income = items.filter(i => i.type === 'income').reduce((s, x) => s + x.amount, 0);
    const expense = items.filter(i => i.type === 'expense').reduce((s, x) => s + x.amount, 0);
    return { income, expense, balance: income - expense, items };
  }
}
