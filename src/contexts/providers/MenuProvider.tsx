import { createContext, useContext, type ReactNode } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { container } from '../../models/di/container';

const MenuContext = createContext<any>(null);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const menuState = useMenu(container.menuRepo, container.categoryRepo);

  return (
    <MenuContext.Provider value={menuState}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => useContext(MenuContext);
