import { createContext, useContext, type ReactNode } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import type { ISystemSettingsRepository } from '../repos/interfaces/ISystemSettingsRepository';
import type { IRulesRepository } from '../repos/interfaces/IRulesRepository';

interface AdminProviderProps {
  settingsRepo: ISystemSettingsRepository;
  rulesRepo: IRulesRepository;
  children: ReactNode;
}

const AdminContext = createContext<any>(null);

export const AdminProvider = ({ settingsRepo, rulesRepo, children }: AdminProviderProps) => {
  const state = useAdmin(settingsRepo, rulesRepo);
  return <AdminContext.Provider value={state}>{children}</AdminContext.Provider>;
};

export const useAdminContext = () => useContext(AdminContext);
