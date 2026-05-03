import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Role = "buyer" | "seller" | "rider";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role | null;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: (isNew?: boolean) => Promise<AuthUser>;
  setRole: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "morsel.auth.user";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(async (email: string, _password: string) => {
    await wait(700);
    // Simulate: returning user keeps existing role from storage if same email; else new user no role
    const raw = localStorage.getItem(STORAGE_KEY);
    let role: Role | null = null;
    if (raw) {
      try {
        const prev = JSON.parse(raw) as AuthUser;
        if (prev.email === email) role = prev.role;
      } catch { /* ignore */ }
    }
    const u: AuthUser = {
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
      role,
    };
    persist(u);
    return u;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    await wait(800);
    const u: AuthUser = { id: crypto.randomUUID(), email, name, role: null };
    persist(u);
    return u;
  }, []);

  const loginWithGoogle = useCallback(async (isNew = false) => {
    await wait(700);
    const raw = localStorage.getItem(STORAGE_KEY);
    let existing: AuthUser | null = null;
    if (raw && !isNew) {
      try { existing = JSON.parse(raw); } catch { /* ignore */ }
    }
    const u: AuthUser = existing ?? {
      id: crypto.randomUUID(),
      email: "you@gmail.com",
      name: "Google User",
      role: null,
    };
    persist(u);
    return u;
  }, []);

  const setRole = useCallback((role: Role) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => persist(null), []);

  const value = useMemo(
    () => ({ user, loading, login, register, loginWithGoogle, setRole, logout }),
    [user, loading, login, register, loginWithGoogle, setRole, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
