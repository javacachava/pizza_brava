import type { ID, Timestamp } from './SharedTypes';

export interface Option {
  id: ID;
  name: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
