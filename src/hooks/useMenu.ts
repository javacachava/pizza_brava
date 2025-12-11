import { useEffect, useState, useCallback } from 'react';
// ... imports ...
import { useAuthContext } from '../contexts/AuthContext'; // Importar contexto
import type { MenuItem } from '../models';
import type { Category } from '../models';
import type { IMenuRepository } from '../repos/interfaces/IMenuRepository';
import type { ICategoryRepository } from '../repos/interfaces/ICategoryRepository';
import { MenuService } from '../services/domain/MenuService';

export function useMenu(menuRepo: IMenuRepository, categoryRepo: ICategoryRepository) {
  const menuService = new MenuService(menuRepo, categoryRepo);
  const { isAuthenticated } = useAuthContext(); // Obtener estado

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    // 🛑 ESCUDO: Si no hay usuario, no hacemos nada.
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const itemsList = await menuService.getMenu();
      const categoriesList = await menuService.getCategories();
      setItems(itemsList);
      setCategories(categoriesList);
    } catch (e) {
      console.error("Error cargando menú:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]); // Dependencia clave

  useEffect(() => {
    if (isAuthenticated) {
        load();
    }
  }, [isAuthenticated, load]); // Solo carga cuando cambia
}