import { BaseRepository } from '../BaseRepository';
import type { Rule } from '../../models/Rules';
import type { IRulesRepository } from '../interfaces/IRulesRepository';

export class RulesRepository extends BaseRepository<Rule> implements IRulesRepository {
  constructor() { super('rules'); }
  async getAll(): Promise<Rule[]> { return super.getAll(); }
}
