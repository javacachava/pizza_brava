import React, { useEffect } from 'react';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { MainLayout } from '../app/layout/MainLayout';
import { AdminLayout } from '../app/pages/admin/AdminLayout';
import { ProtectedRoute } from '../app/components/auth/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

// Pages
import { LoginPage } from '../app/components/auth/LoginPage';
import { Dashboard } from '../app/pages/admin/Dashboard';
import { ProductsManager } from '../app/pages/admin/ProductsManager';
import { CategoriesManager } from '../app/pages/admin/CategoriesManager';
import { UsersManager } from '../app/pages/admin/UsersManager'; 
import { CashClose } from '../app/pages/admin/CashClose';
import { POSPage } from '../app/pages/pos/POSPage';
import { KitchenPage } from '../app/pages/kitchen/KitchenPage';

// Componente "Dispatcher" que decide a dónde enviar al usuario logueado si entra a raíz
const RootDispatcher: React.FC = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated && user) {
                switch(user.role) {
                    case 'admin': navigate('/admin'); break;
                    case 'cashier': navigate('/pos'); break;
                    case 'kitchen': navigate('/kitchen'); break;
                    default: navigate('/pos');
                }
            }
        }
    }, [user, isAuthenticated, loading, navigate]);

    if (loading) return <div>Cargando...</div>;
    return <LoginPage />; 
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />, 
        children: [
            { 
                index: true, 
                element: <RootDispatcher /> 
            },
            {
                path: 'login',
                element: <LoginPage />
            },
            // --- RUTAS ADMIN (Protegidas: Solo Admin) ---
            {
                path: 'admin',
                element: (
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout />
                    </ProtectedRoute>
                ),
                children: [
                    { path: '', element: <Dashboard /> },
                    { path: 'products', element: <ProductsManager /> },
                    { path: 'categories', element: <CategoriesManager /> },
                    { path: 'users', element: <UsersManager /> }, 
                    { path: 'orders', element: <CashClose /> }
                ]
            },
            // --- RUTA POS (Protegida: Admin + Cashier + Waiter) ---
            {
                path: 'pos',
                element: (
                    <ProtectedRoute allowedRoles={['admin', 'cashier', 'waiter']}>
                        <POSPage />
                    </ProtectedRoute>
                )
            },
            // --- RUTA COCINA (Protegida: Admin + Kitchen) ---
            {
                path: 'kitchen',
                element: (
                    <ProtectedRoute allowedRoles={['admin', 'kitchen']}>
                        <KitchenPage />
                    </ProtectedRoute>
                )
            }
        ]
    }
]);