import type { ICashFlowRepository } from '../../repos/interfaces/ICashFlowRepository';
import type { CashFlow, CashFlowType } from '../../models/CashFlow';

export class CashService {
  private cashRepo: ICashFlowRepository;

  constructor(cashRepo: ICashFlowRepository) {
    this.cashRepo = cashRepo;
  }

  async register(type: CashFlowType, amount: number, description?: string) {
    if (amount <= 0) throw new Error('El monto debe ser mayor a 0');

    const entry: CashFlow = {
      id: crypto.randomUUID(),
      type,
      amount,
      description,
      createdAt: Date.now()
    };

    return this.cashRepo.create(entry);
  }

  async getDailySummary() {
    return this.cashRepo.getDailySummary();
  }
}
