import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import type { UserRole } from '../../../models/User';

interface Props {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // 1. Loading
    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-slate-500 font-medium">Verificando credenciales...</p>
            </div>
        );
    }

    // 2. No autenticado
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Usuario inactivo
    if (user.active === false) {
        return (
            <div className="h-screen w-full flex items-center justify-center text-red-600 text-xl font-semibold">
                Su cuenta está desactivada. Contacte al administrador.
            </div>
        );
    }

    // 4. Validación de roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {

        // Redirección oficial por rol
        switch (user.role) {
            case 'admin': 
                return <Navigate to="/admin/dashboard" replace />;
            case 'cocina': 
                return <Navigate to="/kitchen" replace />;
            case 'recepcion': 
                return <Navigate to="/pos" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    // 5. Autorizado
    return <>{children}</>;
};
