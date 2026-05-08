import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin, AuthState } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      setAuth: (admin: Admin, token: string) => set({ admin, token }),
      clearAuth: () => set({ admin: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);
