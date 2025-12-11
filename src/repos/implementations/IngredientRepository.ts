import { BaseRepository } from '../BaseRepository';
import type { Ingredient } from '../../models/Ingredient';
import type { IIngredientRepository } from '../interfaces/IIngredientRepository';

export class IngredientRepository extends BaseRepository<Ingredient> implements IIngredientRepository {
  constructor() { super('ingredients'); }
  async getAll(): Promise<Ingredient[]> { return super.getAll(); }
}
