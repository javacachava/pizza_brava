import { useEffect, useState, useCallback } from 'react';
import type { MenuItem } from '../models/MenuItem';
import type { Category } from '../models/Category';
import type { IMenuRepository } from '../repos/interfaces/IMenuRepository';
import type { ICategoryRepository } from '../repos/interfaces/ICategoryRepository';
import { MenuService } from '../services/domain/MenuService';

export function useMenu(menuRepo: IMenuRepository, categoryRepo: ICategoryRepository) {
  const menuService = new MenuService(menuRepo, categoryRepo);

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const itemsList = await menuService.getMenu();
      const categoriesList = await menuService.getCategories();

      setItems(itemsList);
      setCategories(categoriesList);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, []);

  return { items, categories, loading, refresh: load };
}
