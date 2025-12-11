import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { ChefHat, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  
  // Estado local para feedback visual sin bloquear la app
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redirección reactiva: en cuanto el usuario es válido, nos vamos.
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if(!email || !password) {
        setError('Ingresa correo y contraseña.');
        return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      // No navegamos aquí. El useEffect detectará el cambio de estado 'user'
      // y hará la redirección instantáneamente.
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false); // Solo desbloqueamos si hubo error
      
      const msg = err?.message || '';
      if (msg.includes('auth/invalid-credential') || msg.includes('INVALID_LOGIN_CREDENTIALS')) {
        setError('Credenciales incorrectas.');
      } else if (msg.includes('network-request-failed')) {
        setError('Error de conexión. Verifica tu internet.');
      } else {
        setError('No se pudo iniciar sesión. Intenta de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Panel Izquierdo */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg"><ChefHat size={32} /></div>
            <span className="text-2xl font-bold">Pizza Brava POS</span>
        </div>
        <div className="relative z-10">
            <h2 className="text-5xl font-extrabold mb-6">El sabor del éxito.</h2>
            <p className="text-slate-400">Sistema integral de gestión para microempresas.</p>
        </div>
        <div className="relative z-10 text-sm text-slate-500">© 2025 Pizza Brava.</div>
      </div>

      {/* Panel Derecho */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-slate-900">Bienvenido</h1>
                <p className="mt-2 text-slate-600">Ingresa tus credenciales para continuar.</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 flex gap-2 items-center animate-pulse">
                    <AlertCircle size={20} /> <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Correo</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input 
                          type="email" 
                          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" 
                          placeholder="admin@pizzabrava.com" 
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input 
                          type="password" 
                          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" 
                          placeholder="••••••••" 
                          value={password} 
                          onChange={e => setPassword(e.target.value)} 
                        />
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    loading={isSubmitting} 
                    className="w-full py-3 flex justify-center items-center gap-2 font-bold shadow-md hover:shadow-lg transition-all"
                >
                    Ingresar <ArrowRight size={18} />
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
};