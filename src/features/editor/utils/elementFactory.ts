import type { CanvasElement, ElementType, ShapeKind, TextAlign } from "../types";
import { getFieldLabel, sanitizeElementForTemplate } from "./fieldData";

let zCounter = 1;

export function resetZCounter(max: number) {
  zCounter = max + 1;
}

export function createId(): string {
  return `el-${crypto.randomUUID().slice(0, 8)}`;
}

type CreateOpts = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  content?: string;
  fieldKey?: string;
  label?: string;
  src?: string;
  shape?: ShapeKind;
  qrValue?: string;
};

export function createElement(type: ElementType, opts: CreateOpts = {}): CanvasElement {
  const base = {
    id: createId(),
    type,
    x: opts.x ?? 40,
    y: opts.y ?? 40,
    width: opts.width ?? 120,
    height: opts.height ?? 32,
    rotation: 0,
    opacity: 1,
    zIndex: zCounter++,
  };

  switch (type) {
    case "text":
      return {
        ...base,
        content: opts.content ?? "",
        fontFamily: "Inter",
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
        textAlign: "left" as TextAlign,
        lineHeight: 1.2,
        letterSpacing: 0,
        borderRadius: 0,
      };
    case "field": {
      const key = opts.fieldKey ?? "fullName";
      const label = opts.label ?? getFieldLabel(key);
      return sanitizeElementForTemplate({
        ...base,
        fieldKey: key,
        label,
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: "500",
        color: "#111827",
        textAlign: "left" as TextAlign,
        lineHeight: 1.2,
        letterSpacing: 0,
        height: opts.height ?? 24,
      });
    }
    case "image":
      return {
        ...base,
        width: opts.width ?? 80,
        height: opts.height ?? 100,
        src: opts.src ?? "",
        borderRadius: 4,
      };
    case "shape":
      return {
        ...base,
        shape: opts.shape ?? "rect",
        fill: "#006837",
        stroke: "transparent",
        strokeWidth: 0,
        borderRadius: opts.shape === "rect" ? 4 : 0,
        width: opts.width ?? 100,
        height: opts.height ?? 40,
      };
    case "qr":
      return sanitizeElementForTemplate({
        ...base,
        width: opts.width ?? 64,
        height: opts.height ?? 64,
        fill: "#000000",
      });
    default:
      return { ...base, content: "" };
  }
}

export function duplicateElement(el: CanvasElement): CanvasElement {
  return sanitizeElementForTemplate({
    ...el,
    id: createId(),
    x: el.x + 12,
    y: el.y + 12,
    zIndex: zCounter++,
  });
}

export function elementLabel(el: CanvasElement): string {
  if (el.type === "field") return el.label ?? el.fieldKey ?? "Field";
  if (el.type === "text") return el.content?.slice(0, 24) || "Text";
  if (el.type === "image") return "Image";
  if (el.type === "qr") return "QR Code";
  if (el.type === "shape") return el.shape ?? "Shape";
  return "Element";
}
