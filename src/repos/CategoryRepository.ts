import { BaseRepository } from './BaseRepository';
import type { Category } from '../models/Category';
import { query, orderBy, getDocs } from 'firebase/firestore';

export class CategoryRepository extends BaseRepository<Category> {
    constructor() {
        super('categories'); // Colección REAL en Firestore
    }

    /**
     * Obtiene todas las categorías ordenadas por su campo 'order'.
     * Mapea la estructura EXACTA definida en Firestore (name, order).
     * No usa 'active' porque ese campo NO existe en Firestore.
     */
    async getAllOrdered(): Promise<Category[]> {
        const colRef = this.getCollection();
        const q = query(colRef, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                name: data.name,
                order: Number(data.order)
                // NOTA: No leer 'active' porque NO existe en Firestore.
                // Si el frontend requiere active, puede asumirse en la lógica.
            } as Category;
        });
    }
}
