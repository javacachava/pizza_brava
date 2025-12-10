import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from '../contexts/AuthContext';
import { MenuProvider } from '../contexts/MenuContext';
import { POSProvider } from '../contexts/POSContext';
import { KitchenProvider } from '../contexts/KitchenContext';
import { AdminProvider } from '../contexts/AdminContext';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <AuthProvider>
        <AdminProvider>
          <MenuProvider>
            <POSProvider>
              <KitchenProvider>
                <RouterProvider router={router} />
              </KitchenProvider>
            </POSProvider>
          </MenuProvider>
        </AdminProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;