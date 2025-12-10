export type UserRole = 'admin' | 'cocina' | 'recepcion' ;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date | any;
  phone?: string;
}
