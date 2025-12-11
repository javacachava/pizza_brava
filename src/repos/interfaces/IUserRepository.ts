import type { User } from '../../models/User';

export interface IUserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  create(u: Partial<User>): Promise<User>;
  update(id: string, partial: Partial<User>): Promise<void>;
  delete(id: string): Promise<void>;
}
