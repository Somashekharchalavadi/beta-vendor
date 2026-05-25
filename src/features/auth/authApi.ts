import { env } from "../../config/env";
import { parseApiResponse } from "../../lib/api/parseApiResponse";
import { encryptObject } from "../../lib/crypto";
import type { AuthSession, AuthUser } from "./types";

export async function signInApi(input: {
  email?: string;
  mobileNumber?: string;
  password: string;
}): Promise<AuthSession> {
  const payload: Record<string, string> = { password: input.password };
  if (input.email) payload.email = input.email;
  if (input.mobileNumber) payload.mobileNumber = input.mobileNumber;

  const encrypted = await encryptObject(payload);

  const res = await fetch(`${env.apiBaseUrl}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(encrypted),
  });

  return parseApiResponse<AuthSession>(res);
}

export async function validateTokenApi(token: string): Promise<AuthUser> {
  const res = await fetch(`${env.apiBaseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await parseApiResponse<{ user: AuthUser }>(res);
  return data.user;
}

export async function logoutApi(token: string): Promise<void> {
  const res = await fetch(`${env.apiBaseUrl}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  await parseApiResponse<null>(res, { notifySuccess: false });
}
