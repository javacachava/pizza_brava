import type { ID, Timestamp } from './SharedTypes';

export interface Accompaniment {
  id: ID;
  name: string;
  price?: number;
  isAvailable?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
