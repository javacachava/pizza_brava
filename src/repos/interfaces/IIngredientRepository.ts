import type { Ingredient } from '../../models/Ingredient';

export interface IIngredientRepository {
  getAll(): Promise<Ingredient[]>;
  create(i: Ingredient): Promise<Ingredient>;
  update(id: string, partial: Partial<Ingredient>): Promise<void>;
}
