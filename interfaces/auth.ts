import type { User } from 'firebase/auth';

export interface AuthStore {
    user: User | null
}