import type { Option } from '../../models/Option';

export interface IOptionRepository {
  getAll(): Promise<Option[]>;
  create(o: Option): Promise<Option>;
  update(id: string, partial: Partial<Option>): Promise<void>;
}
