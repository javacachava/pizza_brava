import type { Combo } from '../../models/Combo';

export interface IComboRepository {
  getById(id: string): Promise<Combo | null>;
  create(combo: Combo): Promise<Combo>;
  // combos created as order-items maybe only stored in orders; keep basic API
}
