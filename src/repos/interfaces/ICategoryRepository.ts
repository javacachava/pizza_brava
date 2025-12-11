import type { Category } from '../../models/Category';

export interface ICategoryRepository {
  getById(id: string): Promise<Category | null>;
  getAll(): Promise<Category[]>;
  getAllOrdered(): Promise<Category[]>;
  create(cat: Category): Promise<Category>;
  update(id: string, partial: Partial<Category>): Promise<void>;
  delete(id: string): Promise<void>;
}
