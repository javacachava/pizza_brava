import type { MenuItem } from '../../models/MenuItem';

export interface IMenuRepository {
  getById(id: string): Promise<MenuItem | null>;
  getAll(): Promise<MenuItem[]>;
  getAllAvailable(): Promise<MenuItem[]>;
  create(item: MenuItem): Promise<MenuItem>;
  update(id: string, partial: Partial<MenuItem>): Promise<void>;
  delete(id: string): Promise<void>;
  getByCategory(categoryId: string): Promise<MenuItem[]>;
}
