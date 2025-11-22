import { create } from 'zustand';
import { StorageService } from '../services/StorageService';
import { router } from 'expo-router';

interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, pin: string) => Promise<boolean>;
  biometricLogin: (username: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, pin: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  isAuthenticated: false,
  login: async (username, pin) => {
    const success = await StorageService.login(username, pin);
    if (success) {
      set({ username, isAuthenticated: true });
      router.replace('/(tabs)/home');
    }
    return success;
  },
  biometricLogin: async (username) => {
    const success = await StorageService.biometricLogin(username);
    if (success) {
      set({ username, isAuthenticated: true });
      router.replace('/(tabs)/home');
    }
    return success;
  },
  logout: () => {
    StorageService.logout();
    set({ username: null, isAuthenticated: false });
    router.replace('/');
  },
  register: async (username, pin) => {
    try {
      const success = await StorageService.createUser(username, pin);
      return success;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
}));
