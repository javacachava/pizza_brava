import type { ID, Timestamp } from './SharedTypes';

/**
 * Regla simple para almacenar claves / valores arbitrarios.
 * Ej: taxRate, enableStockManagement
 */
export interface Rule {
  id: ID;
  key: string;
  value: any;
  description?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
