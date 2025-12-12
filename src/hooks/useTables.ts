import { useEffect, useState, useCallback } from 'react';
import { container } from '../models/di/container';
import type { Table } from '../models/Table';
import type { ITableRepository } from '../repos/interfaces/ITableRepository';

export function useTables(repo: ITableRepository = container.tablesRepo) {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await repo.getAll();
      setTables(list);
    } catch (error) {
      console.error("Error cargando mesas:", error);
    } finally {
      setLoading(false);
    }
  }, [repo]);

  const update = useCallback(async (id: string, data: Partial<Table>) => {
    try {
      await repo.update(id, data);
      await load();
    } catch (error) {
      console.error("Error actualizando mesa:", error);
    }
  }, [repo, load]);

  useEffect(() => {
    load();
  }, [load]);

  return { tables, loading, update, refresh: load };
}