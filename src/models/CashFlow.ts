import type { ID, Timestamp } from './SharedTypes';

export type CashFlowType = 'income' | 'expense';

export interface CashFlow {
  id: ID;
  amount: number;
  type: CashFlowType;
  description?: string;
  categoryId?: ID | null;
  createdBy?: ID;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
