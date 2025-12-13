import type { ID, Timestamp } from './SharedTypes';

export type TableState = 'free' | 'occupied' | 'reserved';

export interface Table {
  status: string;
  id: ID;
  name: string; // ej. "Mesa 1"
  orderId?: ID | null; // orden actual asociada (si aplica)
  seats?: number;
  active?: boolean;
  state?: TableState;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
