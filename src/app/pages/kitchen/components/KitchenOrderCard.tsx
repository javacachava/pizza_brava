import React from 'react';
import type { Order, OrderStatus } from '../../../../models/Order';
import type { OrderItem } from '../../../../models/OrderItem';
import { Button } from '../../../components/ui/Button';

interface Props {
    order: Order;
    onAdvance: (orderId: string, currentStatus: OrderStatus) => void;
}

export const KitchenOrderCard: React.FC<Props> = ({ order, onAdvance }) => {
    
    const getOrderTypeLabel = (type: string) => {
        switch(type) {
            case 'dine-in': return '🍽️ MESA';
            case 'takeaway': return '👜 LLEVAR';
            case 'delivery': return '🛵 DOMICILIO'; 
            default: return type;
        }
    };

    const getNextActionLabel = (status: string) => {
        switch(status) {
            case 'pending': return '👨‍🍳 COCINAR';
            case 'preparing': return '✅ TERMINAR';
            case 'ready': return '📦 DESPACHAR';
            default: return null;
        }
    };

    // Tiempo transcurrido
    const minutesAgo = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);

    // Sanitización visual del nombre del cliente para eliminar datos de contacto pegados
    // (Asumiendo que en POS concatenamos "Nombre | Tel | Dir")
    const displayCustomerName = order.customerName.split('|')[0].trim();

    return (
        <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
            marginBottom: '15px', 
            borderLeft: `6px solid ${order.status === 'pending' ? '#e53e3e' : order.status === 'preparing' ? '#dd6b20' : '#38a169'}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{ padding: '10px', backgroundColor: '#f7fafc', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        #{order.orderNumber ? order.orderNumber.split('-')[1] : order.id?.slice(-4).toUpperCase()}
                    </span>
                    <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: minutesAgo > 20 ? '#e53e3e' : '#718096', fontWeight: minutesAgo > 20 ? 'bold' : 'normal' }}>
                        {minutesAgo} min
                    </span>
                </div>
                <div style={{ fontWeight: 'bold', color: '#2d3748', backgroundColor: '#edf2f7', padding: '2px 8px', borderRadius: '4px' }}>
                    {getOrderTypeLabel(order.type)}
                    {order.tableNumber && <span style={{ marginLeft: '5px' }}>#{order.tableNumber}</span>}
                </div>
            </div>
            
            {/* Cliente (Limpio) */}
            <div style={{ padding: '5px 10px', backgroundColor: '#fffaf0', borderBottom: '1px solid #edf2f7', fontSize: '1rem', fontWeight: 'bold', color: '#2d3748' }}>
                {displayCustomerName}
            </div>

            {/* Lista de Items */}
            <div style={{ padding: '10px', flex: 1 }}>
                {order.items.map((item: OrderItem, index: number) => (
                    <div key={index} style={{ marginBottom: '8px', borderBottom: index < order.items.length - 1 ? '1px dashed #e2e8f0' : 'none', paddingBottom: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '8px', fontSize: '1.2rem', color: '#2d3748' }}>{item.quantity}</span>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '1.1rem', color: '#2d3748' }}>{item.productName}</span>
                                
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                    <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                                        {item.selectedOptions.map((opt: { name: string; price: number }, i: number) => (
                                            <span key={i} style={{ display: 'inline-block', marginRight: '5px', backgroundColor: '#edf2f7', padding: '0 4px', borderRadius: '3px' }}>
                                                {opt.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                {item.comment && (
                                    <div style={{ backgroundColor: '#fed7d7', color: '#822727', padding: '4px', borderRadius: '4px', marginTop: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        ⚠️ {item.comment}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Acción */}
            <div style={{ padding: '10px' }}>
                <Button 
                    variant={order.status === 'pending' ? 'danger' : order.status === 'preparing' ? 'primary' : 'secondary'}
                    style={{ width: '100%', height: '50px', fontSize: '1.1rem', textTransform: 'uppercase' }}
                    onClick={() => order.id && onAdvance(order.id, order.status)}
                >
                    {getNextActionLabel(order.status)}
                </Button>
            </div>
        </div>
    );
};