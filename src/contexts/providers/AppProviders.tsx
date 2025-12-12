import type { ReactNode } from 'react';
import { container } from '../../models/di/container';

// Importamos desde los archivos originales para evitar duplicados
import { AuthProvider, useAuthContext } from '../AuthContext'; 
import { AdminProvider } from '../AdminContext';
import { MenuProvider } from '../MenuContext';
import { KitchenProvider } from '../KitchenContext';
import { POSProvider } from '../POSContext';
import { OrderProvider } from './OrderProvider'; 

interface AppProvidersProps {
  children: ReactNode;
}

// Componente interno para manejar la lógica de carga y roles
const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuthContext();

  // 1. Si está cargando, mostramos un fallback para evitar montar la app sin datos
  if (loading) return <div className="h-screen w-full bg-white flex items-center justify-center">Cargando sistema...</div>;

  const role = user?.role?.toLowerCase();

  // 2. Definimos el contenido base
  let content = <>{children}</>;

  // 3. Inyectamos proveedores específicos según el rol (Admin/Cocina)
  // Estos son más pesados o específicos, así que se pueden mantener condicionales si se desea,
  // pero KitchenProvider suele ser útil tenerlo disponible si el usuario tiene permisos mixtos.
  if (role === 'admin' || role === 'cocina') {
    content = (
      <KitchenProvider orderRepo={container.ordersRepo}>
        {content}
      </KitchenProvider>
    );
  }

  // 4. Inyectamos AdminProvider SOLO para administradores
  if (role === 'admin') {
    content = (
      <AdminProvider settingsRepo={container.systemSettingsRepo} rulesRepo={container.rulesRepo}>
        {content}
      </AdminProvider>
    );
  }

  // 5. ESTRUCTURA ESTABLE:
  // Envolvemos el contenido dinámico con los Proveedores Globales de Datos.
  // Menu, Order y POS son necesarios para la operación principal y no deben desmontarse.
  // El orden es importante: Menu -> Order -> POS
  return (
    <MenuProvider menuRepo={container.menuRepo} categoryRepo={container.categoryRepo}>
      <OrderProvider>
        <POSProvider>
           {content}
        </POSProvider>
      </OrderProvider>
    </MenuProvider>
  );
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      <AppStateProvider>
        {children}
      </AppStateProvider>
    </AuthProvider>
  );
};