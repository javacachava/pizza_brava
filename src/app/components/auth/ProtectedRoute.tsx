import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // --- CORRECCIÓN AQUÍ ---
  // Convertimos el rol del usuario a minúsculas para asegurar que coincida
  const userRole = user.role ? user.role.toLowerCase() : '';
  
  // Verificamos si el rol normalizado está incluido en los roles permitidos
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  // -----------------------

  return <>{children}</>;
};