import type { Rule } from '../../models/Rules';

export interface IRulesRepository {
  getAll(): Promise<Rule[]>;
  create(r: Rule): Promise<Rule>;
  update(id: string, partial: Partial<Rule>): Promise<void>;
}
