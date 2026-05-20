import type { PanelMode } from "./types";

export const MM_TO_PX = 3.7795275591;

export const SIDEBAR_LEFT = {
  default: 280,
  min: 240,
  max: 380,
} as const;

export const SIDEBAR_RIGHT = {
  default: 300,
  min: 260,
  max: 400,
} as const;

export const SIDEBAR_STORAGE_KEY = "documentsheet-editor-sidebar-widths";

export const PRESET_SIZES = [
  { label: "ID Card (CR80)", w: 85.6, h: 54 },
  { label: "A4 Portrait", w: 210, h: 297 },
  { label: "A4 Landscape", w: 297, h: 210 },
  { label: "Certificate A4", w: 210, h: 297 },
  { label: "Letter Head", w: 216, h: 279 },
  { label: "Badge Small", w: 70, h: 100 },
] as const;

export const FONT_FAMILIES = ["Inter", "Georgia", "Times New Roman", "Arial", "Courier New"];
export const FONT_WEIGHTS = ["400", "500", "600", "700", "800"];

export type FieldCategory = "general" | "document";

/** Layout widgets — use Basic tab (Text / Image), not data field slots. */
export const NON_BINDABLE_FIELD_KEYS = ["text", "image", "date", "number", "dropdown", "signature"] as const;

export const FIELD_DEFINITIONS = [
  { key: "text", label: "Text", category: "general" as const },
  { key: "image", label: "Image", category: "general" as const },
  { key: "date", label: "Date", category: "general" as const },
  { key: "number", label: "Number", category: "general" as const },
  { key: "dropdown", label: "Dropdown", category: "general" as const },
  { key: "signature", label: "Signature", category: "general" as const },
  { key: "fullName", label: "Full Name", category: "general" as const },
  { key: "idNumber", label: "ID Number", category: "general" as const },
  { key: "email", label: "Email", category: "general" as const },
  { key: "phone", label: "Phone", category: "general" as const },
  { key: "title", label: "Title / Role", category: "general" as const },
  { key: "department", label: "Department", category: "general" as const },
  { key: "orgName", label: "Organization Name", category: "document" as const },
  { key: "address", label: "Address", category: "document" as const },
  { key: "issueDate", label: "Issue Date", category: "document" as const },
  { key: "expiryDate", label: "Expiry Date", category: "document" as const },
  { key: "referenceNo", label: "Reference No.", category: "document" as const },
] as const;

export const FIELD_CATEGORIES: { id: FieldCategory; title: string }[] = [
  { id: "general", title: "Common Fields" },
  { id: "document", title: "Document Fields" },
];

/** Sample values for preview only — not editable in the editor; real data comes from the backend. */
export const MOCK_DATA: Record<string, string> = {
  fullName: "John Doe",
  idNumber: "DOC-2025-001",
  email: "hello@example.com",
  phone: "+1 234 567 8900",
  title: "Member",
  department: "Operations",
  orgName: "DocumentSheet",
  address: "123 Business Street, City",
  issueDate: "01 Jan 2025",
  expiryDate: "31 Dec 2025",
  referenceNo: "REF-2025-0847",
  qrCode: "https://documentsheet.app/preview",
  staticText: "Sample text",
  // Legacy keys for saved templates
  studentId: "DOC-2025-001",
  studentName: "John Doe",
  gender: "—",
  dob: "01 Jan 1990",
  course: "—",
};

export const NAV_ITEMS: { mode: PanelMode; label: string }[] = [
  { mode: "templates", label: "Templates" },
  { mode: "elements", label: "Elements" },
  { mode: "text", label: "Text" },
  { mode: "images", label: "Images" },
  { mode: "qr", label: "QR Code" },
  { mode: "shapes", label: "Shapes" },
  { mode: "uploads", label: "Uploads" },
  { mode: "layers", label: "Layers" },
];

export const STORAGE_KEY = "documentsheet-editor-draft";
