// src/contexts/POSContext.tsx
import React, { createContext, useContext } from 'react';
import { usePOS } from '../hooks/usePOS';
import type { MenuItem } from '../models/MenuItem';
import type { OrderItem } from '../models/OrderItem';

interface POSContextValue {
  cart: OrderItem[];
  setCart?: (cart: OrderItem[]) => void;
  addProduct: (product: MenuItem, qty?: number, extras?: number) => void;
  addOrderItem: (item: OrderItem) => void;
  updateQuantity: (index: number, delta: number) => void;
  setItemQuantity: (index: number, qty: number) => void;
  removeIndex: (i: number) => void;
  clear: () => void;
}

const POSContext = createContext<POSContextValue>({} as any);

export const POSProvider = ({ children }: { children: React.ReactNode }) => {
  const pos = usePOS();
  return <POSContext.Provider value={pos}>{children}</POSContext.Provider>;
};

export const usePOSContext = () => {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error('usePOSContext must be used inside POSProvider');
  return ctx;
};
