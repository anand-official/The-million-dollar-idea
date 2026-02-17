import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organization?: {
    id: string;
    name: string;
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

// Simple store without persist for now
export const useAuthStore = create<AuthState>((set) => {
  // Load from localStorage on initialization
  const stored = localStorage.getItem('auth-storage');
  let initial = { token: null, user: null, isAuthenticated: false };
  
  if (stored) {
    try {
      initial = JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse stored auth data:', error);
      localStorage.removeItem('auth-storage');
    }
  }

  return {
    ...initial,
    setAuth: (token, user) => {
      const newState = { token, user, isAuthenticated: true };
      localStorage.setItem('auth-storage', JSON.stringify(newState));
      set(newState);
    },
    logout: () => {
      const newState = { token: null, user: null, isAuthenticated: false };
      localStorage.setItem('auth-storage', JSON.stringify(newState));
      set(newState);
    },
  };
});
