import { BaseRepository } from '../BaseRepository';
import type { MenuItem } from '../../models/MenuItem';
import { query, where, getDocs } from 'firebase/firestore';
import type { IMenuRepository } from '../interfaces/IMenuRepository';

export class MenuRepository extends BaseRepository<MenuItem> implements IMenuRepository {
  constructor() { super('menuItems'); }

  async getAll(): Promise<MenuItem[]> {
    return super.getAll();
  }

  async getAllAvailable(): Promise<MenuItem[]> {
    const q = query(this.collRef, where('isAvailable', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as MenuItem), id: d.id }));
  }

  async getByCategory(categoryId: string): Promise<MenuItem[]> {
    return super.getByField('categoryId', categoryId);
  }
}
