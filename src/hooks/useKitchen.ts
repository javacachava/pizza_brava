import { useEffect, useState, useCallback } from 'react';
import type { Order } from '../models/Order';
import type { IOrderRepository } from '../repos/interfaces/IOrderRepository';
import { KitchenService } from '../services/domain/KitchenService';
import { useAuthContext } from '../contexts/AuthContext';

export function useKitchen(orderRepo: IOrderRepository) {
  const service = new KitchenService(orderRepo);
  const { isAuthenticated } = useAuthContext();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // ============================================
  // LOAD: Solo carga si el usuario está autenticado
  // ============================================
  const load = useCallback(async () => {
    if (!isAuthenticated) return;  // 🛑 ESCUDO
    
    setLoading(true);
    try {
      const pending = await service.getPending();
      setOrders(pending);
    } catch (e) {
      console.error("Error loading kitchen orders:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, service]);

  // ============================================
  // ACCIONES
  // Todas revalidan el listado con load()
  // ============================================
  const markPreparing = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return; // 🛑
      await service.markPreparing(id);
      await load();
    },
    [isAuthenticated, load, service]
  );

  const markReady = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return; // 🛑
      await service.markReady(id);
      await load();
    },
    [isAuthenticated, load, service]
  );

  // ============================================
  // EFECTO: Solo carga cuando el usuario está logueado
  // ============================================
  useEffect(() => {
    if (isAuthenticated) {
      load();
    }
  }, [isAuthenticated, load]);

  // ============================================
  // RETORNO
  // ============================================
  return {
    orders,
    loading,
    refresh: load,
    markPreparing,
    markReady,
  };
}
