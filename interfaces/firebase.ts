import type { User } from 'firebase/auth';

interface Claims {
    [key: string]: any;
  }

export interface AuthState {
  authUser: User | null;
  claims: Claims | null;
}
  