import { createContext, useContext, type ReactNode } from 'react';
import { container } from '../../models/di/container';
import { useAuth } from '../../hooks/useAuth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth(container.usersRepo);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
