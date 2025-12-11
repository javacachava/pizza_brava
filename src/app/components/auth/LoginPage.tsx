import React, { useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loading } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err: any) {
      alert(err?.message || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <form
        onSubmit={submit}
        className="bg-white p-8 shadow-lg rounded-lg w-96 border"
      >
        <h1 className="text-xl font-bold mb-4 text-center">Pizza Brava - Login</h1>

        <label className="block text-sm">Correo</label>
        <input
          className="input-field mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="block text-sm">Contraseña</label>
        <input
          type="password"
          className="input-field mb-6"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-orange-600 text-white w-full py-2 rounded-md hover:bg-orange-700"
          disabled={loading}
        >
          {loading ? 'Entrando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};
