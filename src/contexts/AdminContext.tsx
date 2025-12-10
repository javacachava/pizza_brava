import React, { createContext, useContext, useState, useCallback } from 'react';

interface Notification {
    type: 'success' | 'error' | 'info';
    message: string;
}

interface AdminContextType {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    notification: Notification | null;
    showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
    clearNotification: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setLoading] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);

    const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const clearNotification = useCallback(() => setNotification(null), []);

    return (
        <AdminContext.Provider value={{ 
            isLoading, 
            setLoading, 
            notification, 
            showNotification, 
            clearNotification 
        }}>
            {children}
            
            {notification && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: notification.type === 'error' ? '#c53030' : notification.type === 'success' ? '#2f855a' : '#2b6cb0',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    zIndex: 9999,
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                }}>
                    {notification.message}
                </div>
            )}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within AdminProvider");
    return context;
};