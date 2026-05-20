import { FIELD_DEFINITIONS, MOCK_DATA, NON_BINDABLE_FIELD_KEYS } from "../constants";
import type { CanvasElement, EditorDocument } from "../types";

export function isBindableDataField(fieldKey: string): boolean {
  return !(NON_BINDABLE_FIELD_KEYS as readonly string[]).includes(fieldKey);
}

export function getFieldLabel(fieldKey: string, fallback?: string): string {
  const def = FIELD_DEFINITIONS.find((f) => f.key === fieldKey);
  return def?.label ?? fallback ?? fieldKey;
}

export const TEXT_PLACEHOLDER = "{{Text}}";

/** Placeholder for static text blocks while designing. */
export function getTextPlaceholder(): string {
  return TEXT_PLACEHOLDER;
}

/** Preview label for empty text blocks. */
export function getTextPreviewValue(
  content?: string,
  data?: Record<string, string> | null,
): string {
  if (content?.trim()) return content.trim();
  if (data?.staticText) return data.staticText;
  return MOCK_DATA.staticText || "Sample text";
}

/** Placeholder shown while designing — not stored as user data. */
export function getFieldPlaceholder(fieldKey: string, label?: string): string {
  const name = label ?? getFieldLabel(fieldKey);
  return `{{${name}}}`;
}

/** Sample values for preview; optional `data` uses real sheet/backend values. */
export function getFieldPreviewValue(
  fieldKey: string,
  data?: Record<string, string> | null,
): string {
  if (data && fieldKey in data && data[fieldKey] !== "") {
    return data[fieldKey];
  }
  return MOCK_DATA[fieldKey] ?? "—";
}

export function getQrPreviewValue(data?: Record<string, string> | null): string {
  if (data?.qrCode) return data.qrCode;
  return MOCK_DATA.qrCode ?? "https://documentsheet.app";
}

/** Templates store bindings and layout only — values come from the backend at generation time. */
export function sanitizeTemplateDocument(doc: EditorDocument): EditorDocument {
  const cloned = JSON.parse(JSON.stringify(doc)) as EditorDocument;
  for (const page of cloned.pages) {
    for (const el of page.elements) {
      if (el.type === "field") {
        delete el.content;
      }
      if (el.type === "qr") {
        delete el.qrValue;
      }
    }
  }
  return cloned;
}

/** @deprecated Use sanitizeTemplateDocument */
export const stripFieldValuesFromDocument = sanitizeTemplateDocument;

export function sanitizeElementForTemplate(el: CanvasElement): CanvasElement {
  const copy = { ...el };
  if (copy.type === "field") {
    delete copy.content;
  }
  if (copy.type === "qr") {
    delete copy.qrValue;
  }
  return copy;
}
