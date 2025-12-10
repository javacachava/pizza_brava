import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Table } from "../models/Table";

export class TablesRepository {
    private collectionName = "tables";

    async getActiveTables(): Promise<Table[]> {
        // Solo traemos las mesas activas para el POS
        const q = query(
            collection(db, this.collectionName), 
            where("active", "==", true)
        );
        
        const snapshot = await getDocs(q);
        // Ordenamos en memoria para no requerir índice compuesto en Firestore todavía
        const tables = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Table));

        return tables.sort((a, b) => a.name.localeCompare(b.name));
    }
}