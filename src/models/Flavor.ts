import type { ID, Timestamp } from './SharedTypes';

export interface Flavor {
  id: ID;
  name: string;
  order?: number;
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
