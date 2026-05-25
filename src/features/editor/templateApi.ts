import { env } from "../../config/env";
import { parseApiResponse } from "../../lib/api/parseApiResponse";
import { getStoredToken } from "../auth/authStorage";
import type { EditorDocument } from "./types";

export type TemplateRecord = EditorDocument & {
  id: string;
  vendorId?: string;
  status?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type FieldDefinitionDto = {
  key: string;
  label: string;
  category: string;
  dataType?: string;
};

export type FieldDefinitionsResponse = {
  categories: { id: string; title: string }[];
  fields: FieldDefinitionDto[];
};

export type TemplateListResponse = {
  items: TemplateRecord[];
  pagination: { page: number; limit: number; total: number };
};

function getToken(): string {
  const token = getStoredToken();
  if (!token) throw new Error("Please sign in to use the editor");
  return token;
}

function authHeaders(json = true): HeadersInit {
  const headers: Record<string, string> = { Authorization: `Bearer ${getToken()}` };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

export function getApiOrigin(): string {
  return env.apiBaseUrl.replace(/\/api\/v1\/?$/i, "");
}

export function resolveAssetUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  return `${getApiOrigin()}${url.startsWith("/") ? url : `/${url}`}`;
}

export function templateToDocument(t: TemplateRecord): EditorDocument {
  const bg = t.background ?? { color: "#ffffff", opacity: 1 };
  const opacity =
    typeof bg.opacity === "number" && !Number.isNaN(bg.opacity) ? bg.opacity : 1;
  return {
    title: t.title,
    canvasWidthMm: t.canvasWidthMm,
    canvasHeightMm: t.canvasHeightMm,
    background: { color: bg.color ?? "#ffffff", opacity },
    pages: t.pages,
    uploads: (t.uploads || []).map(resolveAssetUrl),
  };
}

export async function listTemplatesApi(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<TemplateListResponse> {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.search) q.set("search", params.search);
  if (params?.status) q.set("status", params.status);
  const qs = q.toString();
  return parseApiResponse<TemplateListResponse>(
    await fetch(`${env.apiBaseUrl}/templates${qs ? `?${qs}` : ""}`, { headers: authHeaders() }),
  );
}

export async function fetchTemplateApi(
  id: string,
): Promise<{ template: TemplateRecord; document: EditorDocument }> {
  const data = await parseApiResponse<{ template: TemplateRecord }>(
    await fetch(`${env.apiBaseUrl}/templates/${id}`, { headers: authHeaders() }),
  );
  return { template: data.template, document: templateToDocument(data.template) };
}

export async function createTemplateApi(
  body: Partial<EditorDocument> = {},
): Promise<{ template: TemplateRecord; document: EditorDocument }> {
  const data = await parseApiResponse<{ template: TemplateRecord }>(
    await fetch(`${env.apiBaseUrl}/templates`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    }),
  );
  return { template: data.template, document: templateToDocument(data.template) };
}

export async function saveTemplateApi(
  id: string,
  document: EditorDocument,
): Promise<{ template: TemplateRecord; document: EditorDocument }> {
  const data = await parseApiResponse<{ template: TemplateRecord }>(
    await fetch(`${env.apiBaseUrl}/templates/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(document),
    }),
  );
  return { template: data.template, document: templateToDocument(data.template) };
}

export async function patchTemplateApi(
  id: string,
  patch: { title?: string; status?: string },
): Promise<{ template: TemplateRecord; document: EditorDocument }> {
  const data = await parseApiResponse<{ template: TemplateRecord }>(
    await fetch(`${env.apiBaseUrl}/templates/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(patch),
    }),
  );
  return { template: data.template, document: templateToDocument(data.template) };
}

export async function duplicateTemplateApi(
  id: string,
): Promise<{ template: TemplateRecord; document: EditorDocument }> {
  const data = await parseApiResponse<{ template: TemplateRecord }>(
    await fetch(`${env.apiBaseUrl}/templates/${id}/duplicate`, {
      method: "POST",
      headers: authHeaders(),
    }),
  );
  return { template: data.template, document: templateToDocument(data.template) };
}

export async function deleteTemplateApi(id: string): Promise<void> {
  await parseApiResponse<unknown>(
    await fetch(`${env.apiBaseUrl}/templates/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),
  );
}

export async function fetchFieldDefinitionsApi(): Promise<FieldDefinitionsResponse> {
  return parseApiResponse<FieldDefinitionsResponse>(
    await fetch(`${env.apiBaseUrl}/field-definitions`, { headers: authHeaders() }),
  );
}

export async function uploadTemplateAssetApi(
  templateId: string,
  dataUrl: string,
  fileName?: string,
): Promise<{ assetId: string; url: string }> {
  const data = await parseApiResponse<{ assetId: string; url: string; fileName: string }>(
    await fetch(`${env.apiBaseUrl}/templates/${templateId}/assets`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ dataUrl, fileName }),
    }),
  );
  return { assetId: data.assetId, url: resolveAssetUrl(data.url) };
}

export async function deleteTemplateAssetApi(templateId: string, assetId: string): Promise<void> {
  await parseApiResponse<unknown>(
    await fetch(`${env.apiBaseUrl}/templates/${templateId}/assets/${assetId}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),
  );
}
