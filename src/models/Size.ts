import type { ID, Timestamp } from './SharedTypes';

export interface Size {
  id: ID;
  name: string;
  multiplier: number; // ej. 1, 1.5, 2
  order?: number;
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
