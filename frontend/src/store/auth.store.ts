import { create } from "zustand";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: "SUPER_ADMIN" | "ADMIN";
}

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AdminUser, remember?: boolean) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("spelloria_admin_token") || sessionStorage.getItem("spelloria_admin_token") : null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("spelloria_admin_user") ||
          sessionStorage.getItem("spelloria_admin_user") ||
          "null"
        )
      : null,
  isAuthenticated:
    typeof window !== "undefined"
      ? Boolean(
          localStorage.getItem("spelloria_admin_token") ||
          sessionStorage.getItem("spelloria_admin_token")
        )
      : false,
  isLoading: false,

  login: (token: string, user: AdminUser, remember: boolean = true) => {
    if (typeof window !== "undefined") {
      if (remember) {
        localStorage.setItem("spelloria_admin_token", token);
        localStorage.setItem("spelloria_admin_user", JSON.stringify(user));
        sessionStorage.removeItem("spelloria_admin_token");
        sessionStorage.removeItem("spelloria_admin_user");
      } else {
        sessionStorage.setItem("spelloria_admin_token", token);
        sessionStorage.setItem("spelloria_admin_user", JSON.stringify(user));
        localStorage.removeItem("spelloria_admin_token");
        localStorage.removeItem("spelloria_admin_user");
      }
    }
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    const token = get().token;
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.warn("Logout notification error:", e);
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("spelloria_admin_token");
      localStorage.removeItem("spelloria_admin_user");
      sessionStorage.removeItem("spelloria_admin_token");
      sessionStorage.removeItem("spelloria_admin_user");
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        get().logout();
        return false;
      }
      const data = await res.json();
      set({ user: data.user, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },
}));
