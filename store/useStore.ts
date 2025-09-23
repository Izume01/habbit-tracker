// store/useAuthStore.ts
import { account } from "../lib/appwrite";
import { ID, Models } from "react-native-appwrite";
import { create } from "zustand";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;

  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await account.create({ userId: ID.unique(), email, password });
      // after registering, use new signature for login
      await account.createEmailPasswordSession({ email, password });
      const user = await account.get();
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Registration failed", loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // NEW: use object with named properties
      await account.createEmailPasswordSession({ email, password });
      const user = await account.get();
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Login failed", loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await account.deleteSession({
        sessionId: "current",
      });
      set({ user: null, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Logout failed", loading: false });
    }
  },

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const user = await account.get();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));