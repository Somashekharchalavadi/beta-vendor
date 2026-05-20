import type { EditorDocument } from "../types";
import { createElement, resetZCounter } from "./elementFactory";
import { mmToPx } from "./units";

function pageId() {
  return `page-${crypto.randomUUID().slice(0, 8)}`;
}

export function createBlankDocument(title = "DocumentSheet"): EditorDocument {
  resetZCounter(0);
  return {
    title,
    canvasWidthMm: 210,
    canvasHeightMm: 297,
    background: { color: "#ffffff", opacity: 1 },
    pages: [{ id: pageId(), name: "Page 1", elements: [] }],
    uploads: [],
  };
}

/** Default editor canvas: A4 portrait with DocumentSheet branding only. */
export function createDefaultA4Document(): EditorDocument {
  resetZCounter(0);
  const w = mmToPx(210);

  const header = createElement("shape", {
    x: 0,
    y: 0,
    width: w,
    height: 56,
    shape: "rect",
  });
  header.fill = "#006837";
  header.stroke = "transparent";

  const logo = createElement("text", {
    x: 0,
    y: 14,
    width: w,
    height: 36,
    content: "DocumentSheet",
  });
  logo.fontSize = 24;
  logo.fontWeight = "700";
  logo.color = "#ffffff";
  logo.textAlign = "center";

  const elements = [header, logo].map((el, i) => ({ ...el, zIndex: i + 1 }));
  resetZCounter(elements.length);

  return {
    title: "DocumentSheet",
    canvasWidthMm: 210,
    canvasHeightMm: 297,
    background: { color: "#ffffff", opacity: 1 },
    pages: [{ id: pageId(), name: "Page 1", elements }],
    uploads: [],
  };
}

export function createStudentIdTemplate(): EditorDocument {
  resetZCounter(0);
  const w = mmToPx(85.6);
  const h = mmToPx(54);

  const header = createElement("shape", {
    x: 0,
    y: 0,
    width: w,
    height: h * 0.36,
    shape: "rect",
  });
  header.fill = "#006837";
  header.stroke = "transparent";

  const footer = createElement("shape", {
    x: 0,
    y: h - h * 0.12,
    width: w,
    height: h * 0.12,
    shape: "rect",
  });
  footer.fill = "#006837";

  const uni = createElement("text", {
    x: 48,
    y: 14,
    width: w - 56,
    height: 20,
    content: "GREENFIELD UNIVERSITY",
  });
  uni.fontSize = 11;
  uni.fontWeight = "700";
  uni.color = "#ffffff";

  const photo = createElement("image", { x: 14, y: h * 0.38, width: 56, height: 68 });
  photo.src = "";

  const name = createElement("field", {
    x: 82,
    y: h * 0.38,
    width: w - 94,
    height: 26,
    fieldKey: "studentName",
    label: "Student Name",
  });
  name.fontSize = 20;
  name.fontWeight = "700";

  const badge = createElement("text", {
    x: 82,
    y: h * 0.38 + 28,
    width: 60,
    height: 16,
    content: "Student",
  });
  badge.fontSize = 9;
  badge.fontWeight = "600";
  badge.color = "#006837";

  const sid = createElement("field", {
    x: 82,
    y: h * 0.38 + 48,
    width: w - 94,
    height: 18,
    fieldKey: "studentId",
    label: "Student ID",
  });
  sid.fontSize = 9;

  const course = createElement("field", {
    x: 82,
    y: h * 0.38 + 66,
    width: (w - 94) / 2,
    height: 16,
    fieldKey: "course",
    label: "Course",
  });
  course.fontSize = 8;

  const qr = createElement("qr", { x: 14, y: h * 0.38 + 72, width: 48, height: 48 });
  qr.qrValue = "GFU-2024-1847";

  const sig = createElement("text", {
    x: w - 120,
    y: h - h * 0.22,
    width: 100,
    height: 20,
    content: "Aarohi Sharma",
  });
  sig.fontSize = 12;
  sig.fontFamily = "Georgia";
  sig.color = "#374151";

  const emergency = createElement("text", {
    x: 8,
    y: h - h * 0.1,
    width: w - 16,
    height: 14,
    content: "Police: 100  |  Hospital: 108  |  Parents: +91 98xxx",
  });
  emergency.fontSize = 7;
  emergency.color = "#ffffff";
  emergency.textAlign = "center";

  const elements = [header, footer, uni, photo, name, badge, sid, course, qr, sig, emergency].map((el, i) => ({
    ...el,
    zIndex: i + 1,
  }));

  resetZCounter(elements.length);

  return {
    title: "Student ID Card - Modern",
    canvasWidthMm: 85.6,
    canvasHeightMm: 54,
    background: { color: "#ffffff", opacity: 1 },
    pages: [
      { id: pageId(), name: "Front Side", elements },
      { id: pageId(), name: "Back Side", elements: [] },
    ],
    uploads: [],
  };
}

export function createCertificateTemplate(): EditorDocument {
  resetZCounter(0);
  const w = mmToPx(210);
  const h = mmToPx(297);
  const border = createElement("shape", { x: 20, y: 20, width: w - 40, height: h - 40, shape: "rect" });
  border.fill = "transparent";
  border.stroke = "#006837";
  border.strokeWidth = 3;

  const title = createElement("text", { x: 40, y: 80, width: w - 80, height: 48, content: "Certificate of Excellence" });
  title.fontSize = 36;
  title.fontWeight = "700";
  title.color = "#006837";
  title.textAlign = "center";

  const body = createElement("text", {
    x: 60,
    y: 160,
    width: w - 120,
    height: 80,
    content: "This is to certify that the bearer has successfully completed the program with outstanding performance.",
  });
  body.fontSize = 16;
  body.textAlign = "center";

  const name = createElement("field", {
    x: 60,
    y: 280,
    width: w - 120,
    height: 40,
    fieldKey: "fullName",
    label: "Full Name",
  });
  name.fontSize = 28;
  name.fontWeight = "700";
  name.textAlign = "center";

  const elements = [border, title, body, name];
  resetZCounter(elements.length);

  return {
    title: "Certificate of Excellence",
    canvasWidthMm: 210,
    canvasHeightMm: 297,
    background: { color: "#fffef8", opacity: 1 },
    pages: [{ id: pageId(), name: "Page 1", elements }],
    uploads: [],
  };
}

export function createLetterheadTemplate(): EditorDocument {
  resetZCounter(0);
  const w = mmToPx(216);

  const bar = createElement("shape", { x: 0, y: 0, width: w, height: 48, shape: "rect" });
  bar.fill = "#006837";

  const logo = createElement("text", { x: 24, y: 12, width: 200, height: 28, content: "DocumentSheet" });
  logo.fontSize = 16;
  logo.fontWeight = "700";
  logo.color = "#ffffff";

  const line = createElement("shape", { x: 24, y: 100, width: w - 48, height: 2, shape: "rect" });
  line.fill = "#e2e8f0";

  resetZCounter(3);

  return {
    title: "Letter Head - Corporate",
    canvasWidthMm: 216,
    canvasHeightMm: 279,
    background: { color: "#ffffff", opacity: 1 },
    pages: [{ id: pageId(), name: "Page 1", elements: [bar, logo, line] }],
    uploads: [],
  };
}

export const TEMPLATE_LIST = [
  { id: "blank", name: "Blank A4", description: "Empty A4 canvas", build: () => createBlankDocument() },
  { id: "default", name: "DocumentSheet A4", description: "A4 with DocumentSheet header", build: createDefaultA4Document },
  { id: "student-id", name: "Student ID Card", description: "CR80 modern layout", build: createStudentIdTemplate },
  { id: "certificate", name: "Certificate A4", description: "Award certificate", build: createCertificateTemplate },
  { id: "letterhead", name: "Letter Head", description: "Corporate letterhead", build: createLetterheadTemplate },
] as const;
