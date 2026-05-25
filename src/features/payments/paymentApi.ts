import { env } from "../../config/env";
import { parseApiResponse } from "../../lib/api/parseApiResponse";
import { getStoredToken } from "../auth/authStorage";
import type { CreateSheetRequestPayload } from "../sheet-requests/sheetRequestApi";
import type { SheetRequestRecord } from "../sheet-requests/sheetRequestApi";

export type PaymentConfig = {
  enabled: boolean;
  phonepeConfigured: boolean;
  mockMode: boolean;
  costPerSheetInr: number;
  currency: string;
};

export type PaymentRecord = {
  id: string;
  merchantTransactionId: string;
  vendorId: string;
  amountPaise: number;
  amountInr: string;
  seatCount: number;
  status: string;
  mockPayment?: boolean;
  sheetRequestId?: string | null;
  redirectUrl?: string;
  mockMode?: boolean;
  costPerSheetInr?: number;
  failureReason?: string | null;
};

export type InitiatePaymentResponse = {
  payment: PaymentRecord;
};

export type PaymentStatusResponse = {
  payment: PaymentRecord;
  sheetRequest: SheetRequestRecord | null;
  phonepeState?: string;
  mockMode?: boolean;
};

function authHeaders(): HeadersInit {
  const token = getStoredToken();
  if (!token) throw new Error("Please sign in");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchPaymentConfigApi(): Promise<PaymentConfig> {
  return parseApiResponse<PaymentConfig>(
    await fetch(`${env.apiBaseUrl}/payments/config`, { headers: authHeaders() }),
  );
}

export async function initiateSheetPaymentApi(
  payload: CreateSheetRequestPayload,
): Promise<InitiatePaymentResponse> {
  return parseApiResponse<InitiatePaymentResponse>(
    await fetch(`${env.apiBaseUrl}/payments/sheet-request/initiate`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),
    { notifySuccess: false, notifyToast: true },
  );
}

export async function fetchPaymentStatusApi(
  merchantTransactionId: string,
): Promise<PaymentStatusResponse> {
  return parseApiResponse<PaymentStatusResponse>(
    await fetch(`${env.apiBaseUrl}/payments/status/${encodeURIComponent(merchantTransactionId)}`, {
      headers: authHeaders(),
    }),
    { notifySuccess: false, notifyToast: false },
  );
}

export async function completeMockPaymentApi(
  merchantTransactionId: string,
): Promise<PaymentStatusResponse> {
  return parseApiResponse<PaymentStatusResponse>(
    await fetch(
      `${env.apiBaseUrl}/payments/mock-complete/${encodeURIComponent(merchantTransactionId)}`,
      { method: "POST", headers: authHeaders() },
    ),
    { notifySuccess: true, notifyToast: true },
  );
}
