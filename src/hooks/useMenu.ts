import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { container } from '../models/di/container';
import type { MenuItem } from '../models/MenuItem';
import type { Category } from '../models/Category';
import type { Combo } from '../models/Combo';
import type { IMenuRepository } from '../repos/interfaces/IMenuRepository';
import type { ICategoryRepository } from '../repos/interfaces/ICategoryRepository';
import type { IComboRepository } from '../repos/interfaces/IComboRepository';
import { MenuService } from '../services/domain/MenuService';
import { ComboService } from '../services/domain/ComboService';

export function useMenu(
  menuRepo: IMenuRepository = container.menuRepo,
  categoryRepo: ICategoryRepository = container.categoryRepo,
  comboRepo: IComboRepository = container.comboRepo
) {
  const { isAuthenticated } = useAuthContext();
  
  // Servicios de Dominio (Domain Layer)
  // Se instancian aquí o podrían venir inyectados si se registraran como servicios en el container
  const menuService = new MenuService(menuRepo, categoryRepo);
  const comboService = new ComboService(comboRepo); 

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      // Parallel fetching para optimizar tiempo de carga
      const [itemsList, categoriesList, combosList] = await Promise.all([
        menuService.getMenu(),
        menuService.getCategories(),
        comboService.getAll() // Asumiendo que ComboService tiene getAll()
      ]);

      setItems(itemsList);
      setCategories(categoriesList);
      setCombos(combosList);
    } catch (e) {
      console.error("Error cargando menú y combos:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]); // Dependencias estables

  useEffect(() => {
    if (isAuthenticated) {
        load();
    }
  }, [isAuthenticated, load]);

  return {
    items,
    products: items, // Alias para compatibilidad con componentes que esperan 'products'
    combos,          // Nueva propiedad requerida por POSPage
    categories,
    loading,
    refresh: load
  };
}