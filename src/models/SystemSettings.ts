import type { ID, Timestamp } from './SharedTypes';

export interface SystemSettings {
  id: ID; // id singleton en DB, ej. 'main_config'
  restaurantName?: string;
  address?: string;
  phone?: string;
  ticketFooter?: string;
  currency?: string;
  taxRate?: number;
  enableStockManagement?: boolean;
  kioskMode?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

