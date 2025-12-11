import { useEffect, useState, useCallback } from 'react';
import type { CashFlow } from '../models/CashFlow';
import type { ICashFlowRepository } from '../repos/interfaces/ICashFlowRepository';
import { CashService } from '../services/domain/CashService';

export function useCashFlow(repo: ICashFlowRepository) {
  const service = new CashService(repo);

  const [summary, setSummary] = useState<any>(null);
  const [flows, setFlows] = useState<CashFlow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await repo.getAll();
      setFlows(all);

      const info = await service.getDailySummary();
      setSummary(info);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (type: 'income' | 'expense', amount: number, desc?: string) => {
    await service.register(type, amount, desc);
    await load();
  }, []);

  useEffect(() => {
    load();
  }, []);

  return { flows, summary, loading, add, refresh: load };
}
