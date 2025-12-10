import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    type User as FirebaseUser,
    type Auth
} from 'firebase/auth';
import { auth } from '../firebase';
import { UsersRepository } from '../../repos/UsersRepository';
import type { User } from '../../models/User';

export class AuthService {
    private usersRepo: UsersRepository;
    private auth: Auth;

    constructor() {
        this.usersRepo = new UsersRepository();
        this.auth = auth;
    }

    async login(email: string, password: string): Promise<User> {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const fbUser = userCredential.user;
        
        return await this.fetchUserProfile(fbUser);
    }

    async logout(): Promise<void> {
        await signOut(this.auth);
    }
    
    onAuthStateChange(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(this.auth, async (fbUser) => {
            if (fbUser) {
                try {
                    const userProfile = await this.fetchUserProfile(fbUser);
                    callback(userProfile);
                } catch (error) {
                    console.error("Error fetching user profile", error);
                    callback(null);
                }
            } else {
                callback(null);
            }
        });
    }

   
    private async fetchUserProfile(fbUser: FirebaseUser): Promise<User> {
        const dbUser = await this.usersRepo.getByEmail(fbUser.email || '');
        
        if (dbUser) {
            return dbUser;
        }

        return {
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || 'Usuario',
            role: 'waiter', 
            isActive: true
        };
    }
}