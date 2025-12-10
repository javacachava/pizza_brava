import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/pos');
        } catch (err: any) {
            console.error(err);
            setError('Credenciales inválidas o error de conexión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#1a202c',
            backgroundImage: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
        }}>
            <div style={{ 
                backgroundColor: 'white', 
                padding: '40px', 
                borderRadius: '12px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                width: '100%', 
                maxWidth: '400px' 
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, color: '#ff6b00', fontSize: '2rem' }}>Pizza Brava</h1>
                    <p style={{ color: '#718096', marginTop: '5px' }}>Sistema de Gestión</p>
                </div>

                {error && (
                    <div style={{ 
                        backgroundColor: '#fff5f5', 
                        color: '#c53030', 
                        padding: '10px', 
                        borderRadius: '6px', 
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#4a5568', fontWeight: 'bold' }}>Correo Electrónico</label>
                        <input 
                            type="email" 
                            required
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@pizzabrava.com"
                            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#4a5568', fontWeight: 'bold' }}>Contraseña</label>
                        <input 
                            type="password" 
                            required
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                        />
                    </div>

                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={isSubmitting}
                        style={{ marginTop: '10px', height: '50px', fontSize: '1.1rem' }}
                    >
                        {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
                    </Button>
                </form>
            </div>
        </div>
    );
};