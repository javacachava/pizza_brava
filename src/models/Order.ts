import type { ID, Timestamp } from './SharedTypes';
import type { OrderItem } from './OrderItem';

export type OrderType = 'mesa' | 'llevar' | 'pedido';
export type OrderStatus = 'pendiente' | 'preparando' | 'listo' ;

export interface Order {
  id: ID;
  items: OrderItem[];
  total: number;
  subTotal?: number;
  tax?: number;
  tip?: number;
  customerName?: string;
  orderType: OrderType;
  tableNumber?: string | number | null;
  createdBy?: ID; // usuario que creó la orden
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  status: OrderStatus;
  meta?: Record<string, any>;
}
