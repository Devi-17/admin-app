'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { AdminUser } from '../types';
import { onAuthStateChange, signInWithGoogle, signOut as authSignOut } from '../auth';

interface AuthState {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  initialized: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAdminUser: (adminUser: AdminUser | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      adminUser: null,
      loading: true,
      initialized: false,

      setUser: (user) => set({ user }),
      setAdminUser: (adminUser) => set({ adminUser }),
      setLoading: (loading) => set({ loading }),

      initialize: () => {
        if (get().initialized) {
          return () => {}; // Already initialized
        }

        set({ initialized: true });
        
        const unsubscribe = onAuthStateChange((authState) => {
          set({
            user: authState.user,
            adminUser: authState.adminUser,
            loading: authState.loading,
          });
        });

        return unsubscribe;
      },

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          // Get custom token from server
          const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }
          
          // Sign in with custom token
          const { signInWithToken } = await import('../auth');
          const { user, adminUser } = await signInWithToken(data.customToken);
          set({ user, adminUser, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        set({ loading: true });
        try {
          const { user, adminUser } = await signInWithGoogle();
          set({ user, adminUser, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authSignOut();
          set({ user: null, adminUser: null, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist minimal data, not sensitive info
        initialized: state.initialized,
      }),
    }
  )
);

