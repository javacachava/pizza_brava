import { useEffect, useState, useCallback } from 'react';
import type { IOrderRepository } from '../repos/interfaces/IOrderRepository';
import type { Order } from '../models/Order';
import type { OrderItem } from '../models/OrderItem';
import { OrdersService } from '../services/domain/OrdersService';
import { useAuthContext } from '../contexts/AuthContext';

export function useOrders(orderRepo: IOrderRepository) {
  const service = new OrdersService(orderRepo);
  const { isAuthenticated } = useAuthContext();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // ========================================================
  // LOAD: Cargar órdenes activas solo si hay sesión
  // ========================================================
  const loadActive = useCallback(async () => {
    if (!isAuthenticated) return; // 🛑 ESCUDO

    setLoading(true);
    try {
      const list = await service.getActiveOrders();
      setOrders(list);
    } catch (e) {
      console.error("Error loading orders:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, service]);

  // ========================================================
  // OPERACIONES (todas revalidan)
  // ========================================================
  const createOrder = useCallback(
    async (order: Order) => {
      if (!isAuthenticated) return; // 🛑
      await service.createOrder(order);
      await loadActive();
    },
    [isAuthenticated, loadActive, service]
  );

  const addItem = useCallback(
    async (id: string, item: OrderItem) => {
      if (!isAuthenticated) return; // 🛑
      await service.addItem(id, item);
      await loadActive();
    },
    [isAuthenticated, loadActive, service]
  );

  const updateStatus = useCallback(
    async (id: string, status: Order['status']) => {
      if (!isAuthenticated) return; // 🛑
      await service.updateStatus(id, status);
      await loadActive();
    },
    [isAuthenticated, loadActive, service]
  );

  // ========================================================
  // EFECTO: Cargar únicamente cuando esté logueado
  // ========================================================
  useEffect(() => {
    if (isAuthenticated) {
      loadActive();
    }
  }, [isAuthenticated, loadActive]);

  // ========================================================
  // RETORNO
  // ========================================================
  return {
    orders,
    loading,
    refresh: loadActive,
    createOrder,
    addItem,
    updateStatus,
  };
}
