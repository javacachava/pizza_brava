import type { Flavor } from '../../models/Flavor';

export interface IFlavorRepository {
  getAllOrdered(): Promise<Flavor[]>;
  create(f: Flavor): Promise<Flavor>;
  update(id: string, partial: Partial<Flavor>): Promise<void>;
}
