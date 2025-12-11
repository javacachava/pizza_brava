import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  type DocumentData,
  CollectionReference
} from 'firebase/firestore';

import { db } from '../services/firebase';

export abstract class BaseRepository<T extends { id?: string }> {
  protected collRef: CollectionReference<DocumentData>;
  protected collectionPath: string;

  constructor(collectionPath: string) {
    this.collectionPath = collectionPath;
    this.collRef = collection(db, collectionPath);
  }

  async create(entity: T): Promise<T> {
    const data = { ...entity };

    if (entity.id) {
      const ref = doc(this.collRef, entity.id);
      await setDoc(ref, data, { merge: true });
      return { ...(data as any) } as T;
    }

    const res = await addDoc(this.collRef, data);
    return { ...(data as any), id: res.id } as T;
  }

  async getById(id: string): Promise<T | null> {
    const ref = doc(this.collRef, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { ...(snap.data() as T), id: snap.id };
  }

  async update(id: string, partial: Partial<T>): Promise<void> {
    const ref = doc(this.collRef, id);
    await updateDoc(ref, partial as any);
  }

  async delete(id: string): Promise<void> {
    const ref = doc(this.collRef, id);
    await deleteDoc(ref);
  }

  async getAll(limitCount?: number): Promise<T[]> {
    let q = query(this.collRef);
    if (limitCount && limitCount > 0) {
      q = query(this.collRef, limit(limitCount));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as T), id: d.id }));
  }

  async getAllOrdered(orderField = 'order', direction: 'asc' | 'desc' = 'asc'): Promise<T[]> {
    const q = query(this.collRef, orderBy(orderField, direction));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as T), id: d.id }));
  }

  async getByField(field: string, value: any): Promise<T[]> {
    const q = query(this.collRef, where(field, '==', value));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as T), id: d.id }));
  }

  onSnapshot(callback: (items: T[]) => void) {
    return onSnapshot(this.collRef, snap => {
      const items = snap.docs.map(d => ({ ...(d.data() as T), id: d.id }));
      callback(items);
    });
  }
}
