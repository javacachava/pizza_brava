import { BaseRepository } from './BaseRepository';
import type { User, UserRole } from '../models/User';
import { query, where, getDocs } from 'firebase/firestore';

export class UsersRepository extends BaseRepository<User> {
  constructor() {
    super('users'); // Colección REAL en Firestore
  }

  /**
   * Obtiene un usuario por correo y lo mapea correctamente
   * a la estructura real de Firestore.
   */
  async getByEmail(email: string): Promise<User | null> {
    const q = query(this.getCollection(), where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    return {
      id: docSnap.id,
      email: data.email,
      name: data.name,
      role: this.validateRole(data.role),
      active: data.active ?? true // si no existe, asumimos true
    };
  }

  /**
   * Normaliza el rol según la base de datos REAL.
   * Acepta SOLO: admin | cocina | recepcion
   * Si llega un rol basura, protege el sistema y asigna recepcion.
   */
  private validateRole(role: string): UserRole {
    if (role === 'admin' || role === 'cocina' || role === 'recepcion') {
      return role;
    }

    console.warn(
      `[UsersRepository] Rol desconocido detectado en Firestore: "${role}". ` +
      `Asignando 'recepcion' como fallback seguro.`
    );

    return 'recepcion';
  }
}
