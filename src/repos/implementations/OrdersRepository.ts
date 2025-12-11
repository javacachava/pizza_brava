import { BaseRepository } from '../BaseRepository';
import type { Order } from '../../models/Order';
import type { IOrderRepository } from '../interfaces/IOrderRepository';
import { query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

export class OrdersRepository extends BaseRepository<Order> implements IOrderRepository {
  constructor() { super('orders'); }

  async create(order: Order): Promise<Order> {
    const withTimestamps = { ...order, createdAt: Date.now() };
    return super.create(withTimestamps as Order);
  }

  async getActiveOrders(): Promise<Order[]> {
    const q = query(this.collRef, where('status', 'in', ['pending', 'preparing', 'ready']));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as Order), id: d.id }));
  }

  async getByStatus(statuses: string[]): Promise<Order[]> {
    if (statuses.length === 0) return [];
    // Firestore supports up to 10 in 'in'
    const q = query(this.collRef, where('status', 'in', statuses));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as Order), id: d.id }));
  }

  async getSummary(range: 'day' | 'week' | 'month'): Promise<any> {
    // Implement a simple summary by fetching recent orders and calculating totals.
    // For performance, you could replace with dedicated aggregation functions (Cloud Functions).
    const now = Date.now();
    const since = range === 'day' ? now - 24 * 3600 * 1000 : range === 'week' ? now - 7 * 24 * 3600 * 1000 : now - 30 * 24 * 3600 * 1000;
    const q = query(this.collRef, where('createdAt', '>=', since), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const orders = snap.docs.map(d => ({ ...(d.data() as Order), id: d.id }));
    const totalSales = orders.reduce((s, o) => s + (o.total || 0), 0);
    const totalOrders = orders.length;
    const avg = totalOrders ? totalSales / totalOrders : 0;
    // top products naive aggregation
    const productCounts: Record<string, { name: string; count: number; total: number }> = {};
    orders.forEach(o => {
      (o.items || []).forEach(it => {
        const pid = it.productId || 'combo';
        if (!productCounts[pid]) productCounts[pid] = { name: it.productName, count: 0, total: 0 };
        productCounts[pid].count += it.quantity;
        productCounts[pid].total += it.totalPrice;
      });
    });
    const topProducts = Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 5);
    return { totalSales, totalOrders, averageTicket: avg, topProducts };
  }
}
