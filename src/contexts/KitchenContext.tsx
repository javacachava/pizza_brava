import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Order, OrderStatus } from '../models/Order';
import { KitchenService } from '../services/domain/KitchenService';

interface KitchenContextType {
    orders: Order[];
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    isConnected: boolean;
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);
const kitchenService = new KitchenService();

export const KitchenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevOrdersLength = useRef(0);

    useEffect(() => {
        audioRef.current = new Audio('/cocina.mp3');
    }, []);

    useEffect(() => {
        const unsubscribe = kitchenService.subscribeToOrders((updatedOrders) => {
            setOrders(updatedOrders);
            setIsConnected(true);
            const currentPending = updatedOrders.filter(o => o.status === 'pending').length;
            
            if (currentPending > 0 && updatedOrders.length > prevOrdersLength.current) {
                playAlertSound();
            }
            prevOrdersLength.current = updatedOrders.length;
        });

        return () => {
            unsubscribe();
            setIsConnected(false);
        };
    }, []);

    const playAlertSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log("Audio play blocked (needs interaction)", e));
        }
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        await kitchenService.updateStatus(orderId, status);
    };

    return (
        <KitchenContext.Provider value={{ orders, updateOrderStatus, isConnected }}>
            {children}
        </KitchenContext.Provider>
    );
};

export const useKitchen = () => {
    const context = useContext(KitchenContext);
    if (!context) throw new Error("useKitchen must be used within KitchenProvider");
    return context;
};