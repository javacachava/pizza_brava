import type { ID, Timestamp } from './SharedTypes';

export type UserRole = 'admin' | 'recepcion' | 'cocina';

export interface User {
  id: ID;
  email: string;
  name: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  // campos opcionales de auth provider
  providerId?: string | null;
}
