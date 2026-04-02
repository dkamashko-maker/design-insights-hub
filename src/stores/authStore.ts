import { create } from "zustand";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: "user" | "admin";
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean }>;
}

// Mock user for demo
const MOCK_USER: UserProfile = {
  id: "mock-user-1",
  firstName: "Анна",
  lastName: "Иванова",
  email: "anna@example.com",
  avatarUrl: null,
  role: "user",
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));

    if (!email || !password) {
      set({ isLoading: false });
      return { success: false, error: "Заполните все поля" };
    }
    if (password.length < 6) {
      set({ isLoading: false });
      return { success: false, error: "Неверный email или пароль" };
    }

    // TODO: Replace with Supabase auth
    set({ user: { ...MOCK_USER, email }, isAuthenticated: true, isLoading: false });
    return { success: true };
  },

  register: async (data) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));

    // TODO: Replace with Supabase auth + profile insert
    set({
      user: {
        ...MOCK_USER,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
      isAuthenticated: false, // not confirmed yet
      isLoading: false,
    });
    return { success: true };
  },

  logout: () => set({ user: null, isAuthenticated: false }),

  resetPassword: async (email) => {
    await new Promise((r) => setTimeout(r, 800));
    // TODO: Replace with Supabase resetPasswordForEmail
    return { success: true };
  },
}));
