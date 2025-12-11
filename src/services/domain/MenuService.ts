import type { IMenuRepository } from '../../repos/interfaces/IMenuRepository';
import type { ICategoryRepository } from '../../repos/interfaces/ICategoryRepository';
import type { MenuItem } from '../../models/MenuItem';
import type { Category } from '../../models/Category';

export class MenuService {
  private menuRepo: IMenuRepository;
  private categoryRepo: ICategoryRepository;

  constructor(menuRepo: IMenuRepository, categoryRepo: ICategoryRepository) {
    this.menuRepo = menuRepo;
    this.categoryRepo = categoryRepo;
  }

  async getMenu(): Promise<MenuItem[]> {
    return this.menuRepo.getAll();
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepo.getAll();
  }

  async createCategory(data: Partial<Category>) {
    if (!data.name) throw new Error('La categoría requiere nombre');
    return this.categoryRepo.create(data as Category);
  }

  async updateCategory(id: string, data: Partial<Category>) {
    return this.categoryRepo.update(id, data);
  }

  async createMenuItem(data: Partial<MenuItem>) {
    if (!data.name) throw new Error('El item requiere nombre');
    if (!data.price) throw new Error('El item requiere precio');
    return this.menuRepo.create(data as MenuItem);
  }

  async updateMenuItem(id: string, data: Partial<MenuItem>) {
    return this.menuRepo.update(id, data);
  }
}
