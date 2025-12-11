import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../models/User';
import { container } from '../models/di/container';
import { onAuthStateChanged } from 'firebase/auth';
import { auth as firebaseAuth } from '../services/firebase';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({} as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authService = container.authService;
  const [user, setUser] = useState<User | null>(null);
  
  // loading: SOLO para la verificación inicial de sesión (F5 o primer acceso)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Timeout de Seguridad: Si Firebase no responde en 6 seg, liberamos la app.
    const safetyTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn("[Auth] Tiempo de espera agotado. Forzando carga.");
        setLoading(false);
      }
    }, 6000);

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (currentUser) {
        try {
          // Intentamos obtener el perfil, pero con un límite de tiempo implícito
          // Si falla o no existe, logout para limpiar estado.
          const profile = await authService.getUserById(currentUser.uid);
          
          if (isMounted) {
            if (profile && profile.isActive) {
              setUser(profile);
            } else {
              // Usuario en Auth pero no en BD o inactivo
              await authService.logout();
              setUser(null);
            }
          }
        } catch (e) {
          console.error("[Auth] Error verificando usuario:", e);
          if (isMounted) setUser(null);
        }
      } else {
        if (isMounted) setUser(null);
      }

      // 2. Liberamos la app (si el timeout no lo hizo ya)
      if (isMounted) setLoading(false);
      clearTimeout(safetyTimeout);
    });

    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []); // Dependencias vacías correcto para init único

  const login = async (email: string, pass: string) => {
    // ⚠️ NO usamos setLoading(true) aquí. 
    // Evitamos desmontar la app completa durante el login.
    const logged = await authService.login(email, pass);
    setUser(logged);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  // Spinner Global: Solo bloquea durante la carga INICIAL
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Iniciando sistema...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export const useAuth = useAuthContext;