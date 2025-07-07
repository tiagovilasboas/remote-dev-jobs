import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  favorites: string[];
}

export interface UserStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  toggleFavorite: (jobId: string) => void;
}

const baseStore = immer<UserStore>((set) => ({
  user: null,
  login: (user) =>
    set((state) => {
      state.user = { ...user };
    }),
  logout: () =>
    set((state) => {
      state.user = null;
    }),
  toggleFavorite: (jobId) =>
    set((state) => {
      if (!state.user) return;
      const idx = state.user.favorites.indexOf(jobId);
      if (idx >= 0) state.user.favorites.splice(idx, 1);
      else state.user.favorites.push(jobId);
    }),
}));

const isBrowser = typeof window !== 'undefined';

export const useUserStore = create<UserStore>()(
  isBrowser
    ? persist(baseStore, {
        name: 'user-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ user: state.user }),
      })
    : baseStore,
); 