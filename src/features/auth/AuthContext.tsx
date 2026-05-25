import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { logoutApi, signInApi, validateTokenApi } from "./authApi";
import { clearStoredSession, getStoredSession, getStoredToken, setStoredSession } from "./authStorage";
import type { AuthUser } from "./types";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: { email?: string; mobileNumber?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function hasActiveSession(token: string | null, user: AuthUser | null): boolean {
  return Boolean(token && user && getStoredToken());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const stored = getStoredSession();
      if (!stored?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const validatedUser = await validateTokenApi(stored.token);
        if (cancelled) return;
        setToken(stored.token);
        setUser(validatedUser);
        setStoredSession({ token: stored.token, user: validatedUser });
      } catch {
        if (cancelled) return;
        clearStoredSession();
        setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (input: { email?: string; mobileNumber?: string; password: string }) => {
    const session = await signInApi(input);
    setStoredSession(session);
    setToken(session.token);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    const currentToken = token ?? getStoredSession()?.token;
    clearStoredSession();
    setToken(null);
    setUser(null);
    client.clear();

    if (currentToken) {
      try {
        await logoutApi(currentToken);
      } catch {
        /* session already cleared locally */
      }
    }
  }, [token, client]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: hasActiveSession(token, user),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
