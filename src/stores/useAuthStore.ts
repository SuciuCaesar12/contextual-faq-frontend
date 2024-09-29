// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/user";

export interface AuthToken {
  token: string;
  expiry: string; // Example: ISO string or timestamp for token expiration
}

// Define the store's state and actions
interface AuthState {
  user: User | null;
  authToken: AuthToken | null;
  login: (user: User, token: AuthToken) => void;
  logout: () => void;
  isLoggedIn: () => boolean; // New function to check login status
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, // Initial state for user
      authToken: null, // Initial state for token

      login: (user: User, token: AuthToken) => {
        set({
          user,
          authToken: token,
        });
      },

      logout: () => {
        set({
          user: null,
          authToken: null,
        });
      },

      isLoggedIn: () => {
        const { user, authToken } = get();
        if (!user || !authToken) {
          return false;
        }

        // Check if the token is expired
        const now = new Date();
        const tokenExpiry = new Date(authToken.expiry);
        return tokenExpiry > now;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
