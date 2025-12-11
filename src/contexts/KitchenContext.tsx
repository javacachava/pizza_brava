import { createContext, useContext, type ReactNode } from 'react';
import { useKitchen } from '../hooks/useKitchen';
import type { IOrderRepository } from '../repos/interfaces/IOrderRepository';

interface KitchenProviderProps {
  orderRepo: IOrderRepository;
  children: ReactNode;
}

const KitchenContext = createContext<any>(null);

export const KitchenProvider = ({ orderRepo, children }: KitchenProviderProps) => {
  const state = useKitchen(orderRepo);
  return <KitchenContext.Provider value={state}>{children}</KitchenContext.Provider>;
};

export const useKitchenContext = () => useContext(KitchenContext);
