import { BaseRepository } from './BaseRepository';
import type { MenuItem } from '../models/MenuItem';
import { query, where, getDocs } from 'firebase/firestore';

export class MenuRepository extends BaseRepository<MenuItem> {
    constructor() {
        // REGLA: La colección REAL en Firestore es 'menuItems', no 'products'
        super('menuItems');
    }

    /**
     * Obtiene todos los productos disponibles de una categoría.
     * Mapea la estructura EXACTA que viene desde Firestore.
     */
    async getByCategory(categoryId: string): Promise<MenuItem[]> {
        const colRef = this.getCollection();

        const q = query(
            colRef,
            where('categoryId', '==', categoryId),
            where('isAvailable', '==', true) // REGLA: Campo real de Firestore
        );

        const snapshot = await getDocs(q);

        // Mapeo seguro a MenuItem
        return snapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                categoryId: data.categoryId,
                name: data.name,
                description: data.description || "",
                price: Number(data.price),
                
                // REGLAS: Campos reales del bootstrap.json
                isAvailable: data.isAvailable ?? true,
                usesIngredients: data.usesIngredients ?? false,
                usesFlavors: data.usesFlavors ?? false,
                usesSizeVariant: data.usesSizeVariant ?? false,
                comboEligible: data.comboEligible ?? false
            } as MenuItem;
        });
    }

    /**
     * Si necesitas un método para traer TODOS los productos activos
     * lo dejamos ya preparado.
     */
    async getAll(): Promise<MenuItem[]> {
        const colRef = this.getCollection();
        const q = query(colRef);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                categoryId: data.categoryId,
                name: data.name,
                description: data.description || "",
                price: Number(data.price),
                isAvailable: data.isAvailable ?? true,
                usesIngredients: data.usesIngredients ?? false,
                usesFlavors: data.usesFlavors ?? false,
                usesSizeVariant: data.usesSizeVariant ?? false,
                comboEligible: data.comboEligible ?? false
            } as MenuItem;
        });
    }
}
