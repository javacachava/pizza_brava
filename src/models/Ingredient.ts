import type { ID, Timestamp } from './SharedTypes';

export interface Ingredient {
  id: ID;
  name: string;
  price?: number;
  unit?: string; // ej. 'unit', 'g', 'ml'
  stock?: number;
  isAvailable?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
