import { env } from "../../config/env";
import { parseApiResponse } from "../../lib/api/parseApiResponse";
import { getStoredToken } from "../auth/authStorage";
import type { TemplateRecord } from "../editor/templateApi";
import type { SheetRequestRecord } from "../sheet-requests/sheetRequestApi";

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

export async function fetchTemplateSheetsPageApi(
  templateId: string,
  page = 1,
): Promise<TemplateSheetsPageResponse> {
  const token = getStoredToken();
  if (!token) throw new Error("Please sign in");
  return parseApiResponse<TemplateSheetsPageResponse>(
    await fetch(`${env.apiBaseUrl}/templates/${templateId}/sheets?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}
