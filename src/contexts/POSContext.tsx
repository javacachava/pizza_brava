import React, { createContext, useContext, useState, useEffect } from 'react';
import type { OrderItem } from '../models/OrderItem';
import { POSService } from '../services/domain/POSService';
import { useAuth } from './AuthContext';

interface POSContextType {
    cart: OrderItem[];
    addToCart: (item: OrderItem) => void;
    removeFromCart: (index: number) => void;
    updateQuantity: (index: number, delta: number) => void;
    clearCart: () => void;
    placeOrder: (customerName: string, type: 'dine-in' | 'takeaway' | 'delivery', extraData?: any) => Promise<string>;
    total: number;
    subtotal: number;
    tax: number;
    isProcessing: boolean;
}

const POSContext = createContext<POSContextType | undefined>(undefined);
const posService = new POSService();

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    const taxRate = 0.00;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const addToCart = (newItem: OrderItem) => {
        setCart(prev => {
            return [...prev, newItem];
        });
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const updateQuantity = (index: number, delta: number) => {
        setCart(prev => prev.map((item, i) => {
            if (i !== index) return item;
            const newQty = Math.max(1, item.quantity + delta);
            return {
                ...item,
                quantity: newQty,
                totalPrice: (item.unitPrice * newQty)
            };
        }));
    };

    const clearCart = () => setCart([]);

    const placeOrder = async (customerName: string, type: 'dine-in' | 'takeaway' | 'delivery', extraData?: any) => {
        if (!user) throw new Error("No hay sesión de usuario activa");
        
        setIsProcessing(true);
        try {
            const orderId = await posService.createOrder(
                cart,
                customerName,
                type,
                user.id,
                extraData?.tableNumber
            );
            
            clearCart();
            return orderId;
        } catch (error) {
            console.error("Error placing order:", error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <POSContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity,
            clearCart, 
            placeOrder, 
            total,
            subtotal,
            tax,
            isProcessing
        }}>
            {children}
        </POSContext.Provider>
    );
};

export const usePOS = () => {
    const context = useContext(POSContext);
    if (!context) throw new Error("usePOS must be used within POSProvider");
    return context;
};