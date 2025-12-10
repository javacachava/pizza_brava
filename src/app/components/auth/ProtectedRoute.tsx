import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import type { UserRole } from '../../../models/User';

interface Props {
    children: React.ReactNode;
    allowedRoles?: UserRole[]; // Roles permitidos
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // 1. Loading: evita redirecciones antes de tiempo
    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-slate-500 font-medium">Verificando credenciales...</p>
            </div>
        );
    }

    // 2. No autenticado → Login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Validación de rol según allowedRoles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // HOME seguro por rol
        let safePath = '/pos';

        if (user.role === 'admin') safePath = '/admin';
        else if (user.role === 'cocina') safePath = '/kitchen';
        else if (user.role === 'recepcion') safePath = '/pos';

        return <Navigate to={safePath} replace />;
    }

    // 4. Todo correcto → Renderiza
    return <>{children}</>;
};
