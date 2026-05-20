import { env } from "../config/env";

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function getCryptoKey(): Promise<CryptoKey> {
  if (!env.encryptionKeyHex || env.encryptionKeyHex.length !== 64) {
    throw new Error("VITE_ENCRYPTION_KEY must be a 64-character hex string");
  }
  const keyBytes = hexToBytes(env.encryptionKeyHex) as BufferSource;
  return crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]);
}

export async function encryptData(plainText: string): Promise<string> {
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const encryptedBytes = new Uint8Array(encrypted);
  return `${bytesToBase64(iv)}:${bytesToBase64(encryptedBytes)}`;
}

export async function encryptObject<T extends Record<string, string>>(
  fields: T,
): Promise<Record<keyof T, string>> {
  const result = {} as Record<keyof T, string>;
  for (const key of Object.keys(fields) as (keyof T)[]) {
    result[key] = await encryptData(fields[key]);
  }
  return result;
}
