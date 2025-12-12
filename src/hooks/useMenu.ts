import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { container } from '../models/di/container';
import type { MenuItem } from '../models/MenuItem';
import type { Category } from '../models/Category';
import type { ComboDefinition } from '../models/ComboDefinition'; // <--- USAR DEFINICIÓN
import type { IMenuRepository } from '../repos/interfaces/IMenuRepository';
import type { ICategoryRepository } from '../repos/interfaces/ICategoryRepository';
import type { IComboDefinitionRepository } from '../repos/interfaces/IComboDefinitionRepository';
import { MenuService } from '../services/domain/MenuService';
import { ComboService } from '../services/domain/ComboService';

export function useMenu(
  menuRepo: IMenuRepository = container.menuRepo,
  categoryRepo: ICategoryRepository = container.categoryRepo,
  comboDefRepo: IComboDefinitionRepository = container.comboDefRepo
) {
  const { isAuthenticated } = useAuthContext();
  
  const menuService = new MenuService(menuRepo, categoryRepo);
  const comboService = new ComboService(comboDefRepo, menuRepo); 

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [combos, setCombos] = useState<ComboDefinition[]>([]); // <--- TIPO CORRECTO
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const [itemsList, categoriesList, combosList] = await Promise.all([
        menuService.getMenu(),
        menuService.getCategories(),
        comboService.getDefinitions() 
      ]);

      setItems(itemsList);
      setCategories(categoriesList);
      setCombos(combosList); // Ya no requiere casting forzado
    } catch (e) {
      console.error("Error cargando menú:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, menuService, comboService]);

  useEffect(() => {
    if (isAuthenticated) {
        load();
    }
  }, [isAuthenticated, load]);

  return {
    items,
    products: items,
    combos,
    categories,
    loading,
    refresh: load
  };
}