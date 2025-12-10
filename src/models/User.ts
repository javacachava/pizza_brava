export type UserRole = 'admin' | 'cocina' | 'recepcion';

export interface User {
    id: string; // ID de Firestore
    email: string;
    name: string;
    role: UserRole;
    active: boolean; // REGLA: Usar 'active', no 'status' ni 'isActive'
}