import type { IMenuRepository } from '../../repos/interfaces/IMenuRepository';
import type { MenuItem } from '../../models/MenuItem';

export class ProductsAdminService {
  private menuRepo: IMenuRepository;

  constructor(menuRepo: IMenuRepository) {
    this.menuRepo = menuRepo;
  }

  async getAll(): Promise<MenuItem[]> {
    return this.menuRepo.getAll();
  }

  async save(product: Partial<MenuItem>) {
    if (!product.name || !product.price || !product.categoryId) {
      throw new Error('Nombre, precio y categoría obligatorios');
    }

    if (product.id) {
      return this.menuRepo.update(product.id, product);
    }

    return this.menuRepo.create(product as MenuItem);
  }
}
