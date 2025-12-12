import type { ReactNode } from 'react';
import { container } from '../../models/di/container';

// Importamos desde los archivos originales
import { AuthProvider, useAuthContext } from '../AuthContext'; 
import { AdminProvider } from '../AdminContext';
import { MenuProvider } from '../MenuContext';
import { KitchenProvider } from '../KitchenContext';
import { POSProvider } from '../POSContext';
import { OrderProvider } from './OrderProvider'; 

interface AppProvidersProps {
  children: ReactNode;
}

// Componente interno que decide qué cargar según el rol
const RoleBasedProviders = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <div className="h-screen w-full bg-white" />; // Un simple placeholder mientras carga

  // Normalizamos el rol para evitar errores de mayúsculas/minúsculas
  const role = user?.role?.toLowerCase();

  // 1. Empezamos con el contenido base (el Router)
  let content = <>{children}</>;

  // 2. Providers de Cocina (Solo si es admin o cocina)
  if (role === 'admin' || role === 'cocina') {
    content = (
      <KitchenProvider orderRepo={container.ordersRepo}>
        {content}
      </KitchenProvider>
    );
  }

  // 3. Providers de Venta/Admin (Admin y Recepción)
  if (role === 'admin' || role === 'recepcion') {
    content = (
      <OrderProvider>
        <POSProvider>
          {content}
        </POSProvider>
      </OrderProvider>
    );
  }

  // 4. Provider de Admin (SOLO Admin)
  if (role === 'admin') {
    content = (
      <AdminProvider settingsRepo={container.systemSettingsRepo} rulesRepo={container.rulesRepo}>
        {content}
      </AdminProvider>
    );
  }

  // Devolvemos el contenido envuelto en los providers específicos de rol
  return <>{content}</>;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      {/* MOVIDO: El MenuProvider ahora envuelve todo de forma estable.
        Esto garantiza que POSPage siempre tenga acceso al contexto, 
        sin importar el estado de carga o el rol del usuario.
      */}
      <MenuProvider menuRepo={container.menuRepo} categoryRepo={container.categoryRepo}>
        <RoleBasedProviders>
          {children}
        </RoleBasedProviders>
      </MenuProvider>
    </AuthProvider>
  );
};