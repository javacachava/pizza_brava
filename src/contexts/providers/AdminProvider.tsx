import { createContext, useContext, type ReactNode } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { container } from '../../models/di/container';

const AdminContext = createContext<any>(null);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const adminState = useAdmin(
    container.systemSettingsRepo,
    container.rulesRepo
  );

  return (
    <AdminContext.Provider value={adminState}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
