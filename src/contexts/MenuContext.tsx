import { createContext, useContext, type ReactNode } from 'react';
import { useMenu } from '../hooks/useMenu';
import type { IMenuRepository } from '../repos/interfaces/IMenuRepository';
import type { ICategoryRepository } from '../repos/interfaces/ICategoryRepository';
import type { MenuItem } from '../models/MenuItem';
import type { Category } from '../models/Category';

interface MenuProviderProps {
  menuRepo: IMenuRepository;
  categoryRepo: ICategoryRepository;
  children: ReactNode;
}

interface MenuContextState {
  items: MenuItem[];
  categories: Category[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const MenuContext = createContext<MenuContextState | null>(null);

export const MenuProvider = ({ menuRepo, categoryRepo, children }: MenuProviderProps) => {
  const menuState = useMenu(menuRepo, categoryRepo);
  return <MenuContext.Provider value={menuState}>{children}</MenuContext.Provider>;
};

export const useMenuContext = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenuContext must be used inside MenuProvider');
  return ctx;
};
