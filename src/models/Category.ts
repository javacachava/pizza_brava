import type { ID, Timestamp } from './SharedTypes';

/**
 * Category (categoría del menú)
 */
export interface Category {
  id: ID;
  name: string;
  order?: number;
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
