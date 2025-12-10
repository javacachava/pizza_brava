import React from 'react';
import { useKitchen } from '../../../contexts/KitchenContext';
import { KitchenColumn } from './components/KitchenColumn';
import { KioskControls } from './components/KioskControls';
import type { OrderStatus } from '../../../models/Order';
import { useAuth } from '../../../hooks/useAuth';

export const KitchenPage: React.FC = () => {
    const { orders, updateOrderStatus, isConnected } = useKitchen();
    const { logout } = useAuth();

    const handleAdvance = (orderId: string, currentStatus: OrderStatus) => {
        let nextStatus: OrderStatus | null = null;
        if (currentStatus === 'pending') nextStatus = 'preparing';
        else if (currentStatus === 'preparing') nextStatus = 'ready';
        else if (currentStatus === 'ready') nextStatus = 'delivered'; // Desaparece del tablero

        if (nextStatus) {
            updateOrderStatus(orderId, nextStatus);
        }
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const preparingOrders = orders.filter(o => o.status === 'preparing');
    const readyOrders = orders.filter(o => o.status === 'ready');

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a202c', color: 'white', overflow: 'hidden' }}>
            {/* Header Minimalista */}
            <div style={{ 
                padding: '10px 20px', 
                backgroundColor: '#2d3748', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #4a5568'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#f6ad55' }}>👨‍🍳 KDS Pizza Brava</h1>
                    <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        backgroundColor: isConnected ? '#48bb78' : '#e53e3e',
                        color: 'white'
                    }}>
                        {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <button onClick={logout} style={{ background: 'none', border: '1px solid #718096', color: '#cbd5e0', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Salir</button>
                </div>
            </div>

            {/* Tablero Kanban */}
            <div style={{ flex: 1, display: 'flex', padding: '10px', overflow: 'hidden', gap: '10px' }}>
                <KitchenColumn 
                    title="NUEVAS" 
                    orders={pendingOrders} 
                    status="pending" 
                    color="#c53030" 
                    onAdvance={handleAdvance}
                />
                <KitchenColumn 
                    title="EN HORNO" 
                    orders={preparingOrders} 
                    status="preparing" 
                    color="#dd6b20" 
                    onAdvance={handleAdvance}
                />
                <KitchenColumn 
                    title="LISTAS" 
                    orders={readyOrders} 
                    status="ready" 
                    color="#2f855a" 
                    onAdvance={handleAdvance}
                />
            </div>

            <KioskControls />
        </div>
    );
};