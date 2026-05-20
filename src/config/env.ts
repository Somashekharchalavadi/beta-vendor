const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001/api/v1";
const ENCRYPTION_KEY_HEX = import.meta.env.VITE_ENCRYPTION_KEY ?? "";

export const env = {
  apiBaseUrl: API_BASE_URL.replace(/\/$/, ""),
  encryptionKeyHex: ENCRYPTION_KEY_HEX,
};
