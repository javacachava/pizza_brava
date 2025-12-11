import { createContext, useContext, type ReactNode } from 'react';
import { usePOS } from '../../hooks/usePOS';

const POSContext = createContext<any>(null);

export const POSProvider = ({ children }: { children: ReactNode }) => {
  const pos = usePOS();
  return (
    <POSContext.Provider value={pos}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOSContext = () => useContext(POSContext);
