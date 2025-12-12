import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { container } from '../models/di/container';
import type { MenuItem } from '../models/MenuItem';
import type { Category } from '../models/Category';
import type { ComboDefinition } from '../models/ComboDefinition';
import type { Flavor } from '../models/Flavor'; // Asegúrate de tener este tipo
import { MenuService } from '../services/domain/MenuService';
import { ComboService } from '../services/domain/ComboService';
// Importamos FlavorService o repositorio
import { FlavorsRepository } from '../repos/implementations/FlavorsRepository';

export function useMenu() {
  const { isAuthenticated } = useAuthContext();
  
  const menuService = new MenuService(container.menuRepo, container.categoryRepo);
  const comboService = new ComboService(container.comboDefRepo, container.menuRepo);
  // Instanciamos repo de sabores directo por simplicidad o úsalo vía servicio si existe
  const flavorsRepo = new FlavorsRepository();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [combos, setCombos] = useState<ComboDefinition[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]); // <--- NUEVO
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const [fetchedItems, fetchedCategories, fetchedCombos, fetchedFlavors] = await Promise.all([
        menuService.getMenu(),
        menuService.getCategories(),
        comboService.getDefinitions(),
        flavorsRepo.getAll() // <--- Cargar sabores
      ]);

      setItems(fetchedItems);
      setCategories(fetchedCategories);
      setCombos(fetchedCombos);
      setFlavors(fetchedFlavors);
    } catch (e) {
      console.error("Error cargando datos POS:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  return {
    categories,
    products: items,
    combos,
    flavors, // <--- Exportamos
    loading,
    refresh: load
  };
}