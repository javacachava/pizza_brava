import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { UsersRepository } from '../../repos/UsersRepository';
import type { User, UserRole } from '../../models/User';

export class UsersAdminService {
    private usersRepo: UsersRepository;

    constructor() {
        this.usersRepo = new UsersRepository();
    }

    async getAllUsers(): Promise<User[]> {
        return await this.usersRepo.getAll();
    }

    async createUser(data: { email: string; password: string; name: string; role: UserRole }): Promise<void> {
        try {
            const createUserFunction = httpsCallable(functions, 'createUser');
            await createUserFunction(data);
        } catch (error: any) {
            console.error("Error creating user:", error);
            throw new Error(error.message || "Error al crear usuario.");
        }
    }

    async updateUser(id: string, data: Partial<User>): Promise<void> {
        await this.usersRepo.update(id, data);
    }

    async toggleUserStatus(user: User): Promise<void> {
        await this.usersRepo.update(user.id, { isActive: !user.isActive });
    }
}