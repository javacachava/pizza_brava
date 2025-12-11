import { BaseRepository } from '../BaseRepository';
import type { Combo } from '../../models/Combo';
import type { IComboRepository } from '../interfaces/IComboRepository';

export class ComboRepository extends BaseRepository<Combo> implements IComboRepository {
  constructor() { super('combo_instances'); }

  async getById(id: string): Promise<Combo | null> { return super.getById(id); }
  async create(combo: Combo): Promise<Combo> { return super.create(combo); }
}
