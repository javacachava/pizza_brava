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

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                 <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                    <span className="text-slate-500 text-sm font-medium">Verificando acceso...</span>
                 </div>
            </div>
        );
    }

    // 1. No logueado -> Login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Rol no autorizado
    if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'admin') {
        // Redirigir a su área segura
        const redirectPath = user.role === 'kitchen' ? '/kitchen' : '/pos';
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};