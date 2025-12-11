import type { IUserRepository } from '../../repos/interfaces/IUserRepository';
import type { User, UserRole } from '../../models/User';

export class UsersAdminService {
  private users: IUserRepository;

  constructor(users: IUserRepository) {
    this.users = users;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users.getAll();
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) {
    if (!data.email || !data.password || !data.name)
      throw new Error('Todos los campos son obligatorios');

    return this.users.create(data);
  }

  async toggleUserStatus(user: User) {
    return this.users.update(user.id, { isActive: !user.isActive });
  }
}
