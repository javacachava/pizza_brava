import { BaseRepository } from '../BaseRepository';
import type { Flavor } from '../../models/Flavor';
import type { IFlavorRepository } from '../interfaces/IFlavorRepository';

export class FlavorsRepository extends BaseRepository<Flavor> implements IFlavorRepository {
  constructor() { super('flavors'); }
  async getAllOrdered(): Promise<Flavor[]> { return super.getAllOrdered('order', 'asc'); }
}
