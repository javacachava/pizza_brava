import { useEffect, useState, useCallback } from 'react';
import type { Table } from '../models/Table';
import type { ITableRepository } from '../repos/interfaces/ITableRepository';

export function useTables(repo: ITableRepository) {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await repo.getAll();
      setTables(list);
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: Partial<Table>) => {
    await repo.update(id, data);
    await load();
  }, []);

  useEffect(() => {
    load();
  }, []);

  return { tables, loading, update, refresh: load };
}
