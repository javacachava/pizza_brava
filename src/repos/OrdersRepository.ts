import { 
    collection, 
    doc, 
    runTransaction, 
    query, 
    where, 
    orderBy, 
    getDocs,
    onSnapshot,
    Timestamp,
    updateDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { BaseRepository } from './BaseRepository';
import type { Order, OrderStatus } from '../models/Order';

export class OrdersRepository extends BaseRepository<Order> {
    constructor() {
        super('orders');
    }

    // ... (Mantener método createTransactional previo si existe, o incluirlo aquí si se reemplaza el archivo entero)
    // Para asegurar integridad, reitero el método createTransactional brevemente:
    async createTransactional(orderData: Omit<Order, 'id' | 'orderNumber'>): Promise<string> {
        return await runTransaction(db, async (transaction) => {
            const todayStr = new Date().toISOString().split('T')[0];
            const counterRef = doc(db, 'counters', `orders-${todayStr}`);
            const counterDoc = await transaction.get(counterRef);
            
            let newSequence = 1;
            if (counterDoc.exists()) {
                newSequence = counterDoc.data().current + 1;
                transaction.update(counterRef, { current: newSequence });
            } else {
                transaction.set(counterRef, { current: newSequence });
            }

            const orderNumber = `${todayStr.replace(/-/g, '')}-${newSequence.toString().padStart(4, '0')}`;
            const newOrderRef = doc(collection(db, this.collectionName));
            
            const finalOrder: Order = {
                ...orderData,
                id: newOrderRef.id,
                orderNumber: orderNumber,
                createdAt: Timestamp.now()
            };

            transaction.set(newOrderRef, finalOrder);
            return newOrderRef.id;
        });
    }

    async getByStatus(status: OrderStatus): Promise<Order[]> {
        const q = query(
            this.getCollection(), 
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    }
    
    // Método Legacy (Polling) - Mantenido por compatibilidad
    async getActiveOrders(): Promise<Order[]> {
        const q = query(
             this.getCollection(),
             where('status', 'in', ['pending', 'preparing', 'ready']),
             orderBy('createdAt', 'asc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    }

    /**
     * Suscripción Real-Time a órdenes activas.
     * SOLID: Open/Closed -> Extendemos funcionalidad sin modificar la existente destructivamente.
     */
    subscribeToActiveOrders(callback: (orders: Order[]) => void): () => void {
        const q = query(
            this.getCollection(),
            where('status', 'in', ['pending', 'preparing', 'ready']),
            orderBy('createdAt', 'asc')
        );

        // Retorna la función unsubscribe de Firestore
        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => {
                const data = doc.data();
                // Convertir Timestamps a Date si es necesario para el frontend
                return { 
                    id: doc.id, 
                    ...data,
                    // Asegurar que createdAt sea compatible si viene como Timestamp
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
                } as Order;
            });
            callback(orders);
        });
    }

    async updateStatus(id: string, status: OrderStatus): Promise<void> {
        const docRef = doc(db, this.collectionName, id);
        await updateDoc(docRef, { status });
    }
}