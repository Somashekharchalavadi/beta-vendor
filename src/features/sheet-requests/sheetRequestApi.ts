import { env } from "../../config/env";
import { parseApiResponse } from "../../lib/api/parseApiResponse";
import { getStoredToken } from "../auth/authStorage";

export type SheetRequestRecord = {
  id: string;
  vendorId: string;
  templateId: string;
  templateTitle?: string;
  name: string;
  reason?: string;
  eventDate: string;
  state: string;
  district: string;
  pincode: string;
  place: string;
  seatOption: string;
  seatCount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSheetRequestPayload = {
  templateId: string;
  name: string;
  reason?: string;
  eventDate: string;
  state: string;
  district: string;
  pincode: string;
  place: string;
  seatOption: string;
  customSeatCount?: number;
};

export type SheetRequestListResponse = {
  items: SheetRequestRecord[];
  pagination: { page: number; limit: number; total: number };
};

function authHeaders(): HeadersInit {
  const token = getStoredToken();
  if (!token) throw new Error("Please sign in");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function createSheetRequestApi(
  payload: CreateSheetRequestPayload,
): Promise<{ sheetRequest: SheetRequestRecord }> {
  return parseApiResponse<{ sheetRequest: SheetRequestRecord }>(
    await fetch(`${env.apiBaseUrl}/sheet-requests`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),
    { notifySuccess: false, notifyToast: true },
  );
}

export async function listSheetRequestsApi(params?: {
  page?: number;
  limit?: number;
}): Promise<SheetRequestListResponse> {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  const token = getStoredToken();
  if (!token) throw new Error("Please sign in");
  return parseApiResponse<SheetRequestListResponse>(
    await fetch(`${env.apiBaseUrl}/sheet-requests${qs ? `?${qs}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}
