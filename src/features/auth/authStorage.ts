import ls from "localstorage-slim";
import type { AuthSession } from "./types";

export const TOKEN_KEY = "doc_sheet_token";
const USER_KEY = "doc_sheet_user";
const LEGACY_KEY = "documentsheet_auth";

function migrateLegacySession(): AuthSession | null {
  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as AuthSession;
    if (session?.token && session?.user) {
      setStoredSession(session);
      return session;
    }
  } catch {
    /* ignore */
  }
  localStorage.removeItem(LEGACY_KEY);
  return null;
}

export function getStoredSession(): AuthSession | null {
  const token = ls.get<string>(TOKEN_KEY);
  const user = ls.get<AuthSession["user"]>(USER_KEY);
  if (token && user) return { token, user };
  return migrateLegacySession();
}

export function setStoredSession(session: AuthSession): void {
  ls.set(TOKEN_KEY, session.token);
  ls.set(USER_KEY, session.user);
  localStorage.removeItem(LEGACY_KEY);
}

export function clearStoredSession(): void {
  ls.remove(TOKEN_KEY);
  ls.remove(USER_KEY);
  localStorage.removeItem(LEGACY_KEY);
}

export function getStoredToken(): string | null {
  return ls.get<string>(TOKEN_KEY) ?? null;
}
