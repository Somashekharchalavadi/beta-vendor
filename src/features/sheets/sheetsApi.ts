import { env } from "../../config/env";
import { getStoredToken } from "../auth/authStorage";
import type { TemplateRecord } from "../editor/templateApi";
import type { SheetRequestRecord } from "../sheet-requests/sheetRequestApi";

type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; message: string };

export type SheetWithFieldData = SheetRequestRecord & {
  fieldData: Record<string, string>;
};

export type TemplateSheetsPageResponse = {
  template: TemplateRecord;
  sheet: SheetWithFieldData | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
};

async function parseResponse<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiSuccess<T> | ApiError;
  if (!res.ok || !("success" in body) || !body.success) {
    throw new Error("message" in body ? body.message : "Request failed");
  }
  return body.data;
}

export async function fetchTemplateSheetsPageApi(
  templateId: string,
  page = 1,
): Promise<TemplateSheetsPageResponse> {
  const token = getStoredToken();
  if (!token) throw new Error("Please sign in");
  return parseResponse<TemplateSheetsPageResponse>(
    await fetch(`${env.apiBaseUrl}/templates/${templateId}/sheets?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}
