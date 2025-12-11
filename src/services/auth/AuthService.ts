import type { IUserRepository } from '../../repos/interfaces/IUserRepository';
import type { User } from '../../models/User';

export class AuthService {
  private users: IUserRepository;

  constructor(users: IUserRepository) {
    this.users = users;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.users.getByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.getById(id);
  }
}
