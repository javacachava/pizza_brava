import type { ReactNode } from 'react';

// DI CONTAINER
import { container } from '../../models/di/container';

// PROVIDERS
import { AuthProvider } from './AuthProvider';
import { AdminProvider } from './AdminProvider';
import { MenuProvider } from './MenuProvider';
import { OrderProvider } from './OrderProvider';
import { POSProvider } from './POSProvider';

/**
 * APP PROVIDERS TREE
 * Arquitectura profesional:
 *
 * AuthProvider
 *   AdminProvider
 *     MenuProvider
 *       OrderProvider
 *         POSProvider
 *           { children }
 *
 * Cada uno obtiene sus dependencias del DI Container.
 */

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      <AdminProvider>
        <MenuProvider>
          <OrderProvider>
            <POSProvider>
              {children}
            </POSProvider>
          </OrderProvider>
        </MenuProvider>
      </AdminProvider>
    </AuthProvider>
  );
};
