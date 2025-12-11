import { type ReactNode } from 'react';
import { container } from './container';

// Context Providers
import { AuthProvider } from '../../contexts/AuthContext';
import { AdminProvider } from '../../contexts/AdminContext';
import { MenuProvider } from '../../contexts/MenuContext';
import { POSProvider } from '../../contexts/POSContext';
import { KitchenProvider } from '../../contexts/KitchenContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider usersRepo={container.usersRepo}>
      <AdminProvider
        settingsRepo={container.systemSettingsRepo}
        rulesRepo={container.rulesRepo}
      >
        <MenuProvider
          menuRepo={container.menuRepo}
          categoryRepo={container.categoryRepo}
        >
          <KitchenProvider orderRepo={container.ordersRepo}>
            <POSProvider>
              {children}
            </POSProvider>
          </KitchenProvider>
        </MenuProvider>
      </AdminProvider>
    </AuthProvider>
  );
};
