import { useState, useEffect } from 'react';
import { POSService } from '../services/domain/POSService';
import type { Table } from '../models/Table';

const posService = new POSService();

export const useTables = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await posService.getTables();
                setTables(data);
            } catch (error) {
                console.error("Error cargando mesas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    return { tables, loading };
};