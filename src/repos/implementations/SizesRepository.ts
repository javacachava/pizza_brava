import { BaseRepository } from '../BaseRepository';
import type { Size } from '../../models/Size';
import type { ISizeRepository } from '../interfaces/ISizeRepository';

export class SizesRepository extends BaseRepository<Size> implements ISizeRepository {
  constructor() { super('sizes'); }
  async getAll(): Promise<Size[]> { return super.getAll(); }
  async getAllOrdered(): Promise<Size[]> { return super.getAllOrdered('order', 'asc'); }
}
