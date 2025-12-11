import { createContext, useContext, type ReactNode } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { container } from '../../models/di/container';

const OrderContext = createContext<any>(null);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const state = useOrders(container.ordersRepo);

  return (
    <OrderContext.Provider value={state}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
