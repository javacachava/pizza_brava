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
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: '#f7fafc',
                color: '#4a5568'
            }}>
                Cargando sesión...
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'admin') {
        if (user.role === 'kitchen') return <Navigate to="/kitchen" replace />;
        if (user.role === 'cashier') return <Navigate to="/pos" replace />;
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};