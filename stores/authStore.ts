import { updateProfile, type User } from 'firebase/auth';
import { defineStore } from 'pinia';
import type { AuthStore } from '~/interfaces/auth';
import type { AuthState } from '~/interfaces/firebase';

export const useAuthStore = defineStore('auth', {
  state: ():AuthStore => ({
    user: null,
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    async onAuthStateChangedAction({ authUser, claims }:AuthState) {
      if (authUser) {
        this.setUser(authUser);
      } else {
        this.setUser(null);
      }
    },
  },
  persist: true
});
