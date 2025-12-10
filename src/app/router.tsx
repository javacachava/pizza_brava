import React, { useEffect } from 'react';
import { createBrowserRouter, useNavigate, Outlet } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { ProtectedRoute } from './pages/auth/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

// Pages Import
import { LoginPage } from './pages/auth/LoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductsManager } from './pages/admin/ProductsManager';
import { CategoriesManager } from './pages/admin/CategoriesManager';
import { UsersManager } from './pages/admin/UsersManager';
import { CashClose } from './pages/admin/CashClose';
import { POSPage } from './pages/pos/POSPage';
import { KitchenPage } from './pages/kitchen/KitchenPage';

// Componente inteligente para redirigir al inicio según rol
const HomeRedirect: React.FC = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate('/login', { replace: true });
            } else if (user) {
                // Redirección definitiva basada en rol
                const rolePaths: Record<string, string> = {
                    'admin': '/admin',
                    'cashier': '/pos',
                    'waiter': '/pos',
                    'kitchen': '/kitchen'
                };
                const target = rolePaths[user.role] || '/pos';
                navigate(target, { replace: true });
            }
        }
    }, [loading, isAuthenticated, user, navigate]);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
    );
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomeRedirect />
            },
            {
                path: 'login',
                element: <LoginPage />
            },
            // Rutas Admin
            {
                path: 'admin',
                element: <ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>,
                children: [
                    { index: true, element: <Dashboard /> },
                    { path: 'products', element: <ProductsManager /> },
                    { path: 'categories', element: <CategoriesManager /> },
                    { path: 'users', element: <UsersManager /> },
                    { path: 'orders', element: <CashClose /> }
                ]
            },
            // Ruta POS
            {
                path: 'pos',
                element: <ProtectedRoute allowedRoles={['admin', 'cashier', 'waiter']}><POSPage /></ProtectedRoute>
            },
            // Ruta Kitchen
            {
                path: 'kitchen',
                element: <ProtectedRoute allowedRoles={['admin', 'kitchen']}><KitchenPage /></ProtectedRoute>
            }
        ]
    }
]);