import { useState, useCallback } from 'react';
import { AuthService } from '../services/auth/AuthService';
import type { User } from '../models/User';
import type { IUserRepository } from '../repos/interfaces/IUserRepository';

export function useAuth(usersRepo: IUserRepository) {
  const authService = new AuthService(usersRepo);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const u = await authService.login(email, password);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}
