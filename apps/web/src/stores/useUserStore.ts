import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Definição da interface User
export interface User {
  id: string;
  name: string;
}

// Definição do estado da store
export interface UserState {
  user: User | null;
  favorites: string[];
  isLoggedIn: boolean;
}

// Definição das ações da store
export interface UserActions {
  login: (user: User) => void;
  logout: () => void;
  toggleFavorite: (jobId: string) => void;
}

// Combinação de estado e ações para a store completa
export type UserStore = UserState & UserActions;

// Criação da store com os middlewares
export const useUserStore = create<UserStore>()(
  immer(
    persist(
      (set) => ({
        user: null,
        favorites: [],
        isLoggedIn: false,
        login: (user) => set({ user, isLoggedIn: true }),
        logout: () => set({ user: null, isLoggedIn: false }),
        toggleFavorite: (jobId) =>
          set((state) => {
            const index = state.favorites.indexOf(jobId);
            if (index === -1) {
              state.favorites.push(jobId);
            } else {
              state.favorites.splice(index, 1);
            }
          }),
      }),
      {
        name: "user-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
