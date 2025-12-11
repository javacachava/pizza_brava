import { useEffect, useState, useCallback } from 'react';
import type { Order } from '../models/Order';
import type { IOrderRepository } from '../repos/interfaces/IOrderRepository';
import { KitchenService } from '../services/domain/KitchenService';

export function useKitchen(orderRepo: IOrderRepository) {
  const service = new KitchenService(orderRepo);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const pending = await service.getPending();
      setOrders(pending);
    } finally {
      setLoading(false);
    }
  }, []);

  const markPreparing = useCallback(async (id: string) => {
    await service.markPreparing(id);
    await load();
  }, []);

  const markReady = useCallback(async (id: string) => {
    await service.markReady(id);
    await load();
  }, []);

  useEffect(() => {
    load();
  }, []);

  return { orders, loading, refresh: load, markPreparing, markReady };
}
