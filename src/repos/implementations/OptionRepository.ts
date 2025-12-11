import { BaseRepository } from '../BaseRepository';
import type { Option } from '../../models/Option';
import type { IOptionRepository } from '../interfaces/IOptionRepository';

export class OptionRepository extends BaseRepository<Option> implements IOptionRepository {
  constructor() { super('options'); }
  async getAll(): Promise<Option[]> { return super.getAll(); }
}
