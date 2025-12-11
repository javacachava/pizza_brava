import type { CashFlow } from '../../models/CashFlow';

export interface ICashFlowRepository {
  create(entry: CashFlow): Promise<CashFlow>;
  getDailySummary(): Promise<any>;
  getAll(): Promise<CashFlow[]>;
}
