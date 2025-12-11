import type { Table } from '../../models/Table';

export interface ITableRepository {
  getAll(): Promise<Table[]>;
  create(t: Table): Promise<Table>;
  update(id: string, partial: Partial<Table>): Promise<void>;
}
