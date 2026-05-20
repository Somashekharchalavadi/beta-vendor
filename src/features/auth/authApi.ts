import { env } from "../../config/env";
import { encryptObject } from "../../lib/crypto";
import type { AuthSession, AuthUser } from "./types";

type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

type ApiError = {
  success: false;
  message: string;
};

async function parseResponse<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiSuccess<T> | ApiError;
  if (!res.ok || !("success" in body) || !body.success) {
    throw new Error("message" in body ? body.message : "Request failed");
  }
  return body.data;
}

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

  return parseResponse<AuthSession>(res);
}

export async function validateTokenApi(token: string): Promise<AuthUser> {
  const res = await fetch(`${env.apiBaseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await parseResponse<{ user: AuthUser }>(res);
  return data.user;
}

export async function logoutApi(token: string): Promise<void> {
  const res = await fetch(`${env.apiBaseUrl}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  await parseResponse<unknown>(res);
}
