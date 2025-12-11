import { BaseRepository } from '../BaseRepository';
import type { User } from '../../models/User';
import type { IUserRepository } from '../interfaces/IUserRepository';
import { query, where, getDocs } from 'firebase/firestore';

export class UsersRepository extends BaseRepository<User> implements IUserRepository {
  constructor() { super('users'); }

  async getById(id: string): Promise<User | null> { return super.getById(id); }

  async getByEmail(email: string): Promise<User | null> {
    const q = query(this.collRef, where('email', '==', email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { ...(d.data() as User), id: d.id };
  }

  async getAll(): Promise<User[]> { return super.getAll(); }

  async create(u: Partial<User>): Promise<User> {
    const payload = { ...(u as any), createdAt: Date.now(), isActive: u.isActive ?? true };
    return super.create(payload as User);
  }

  async update(id: string, partial: Partial<User>): Promise<void> { return super.update(id, partial); }

  async delete(id: string): Promise<void> { return super.delete(id); }
}
