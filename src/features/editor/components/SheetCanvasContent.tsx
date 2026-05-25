import type { CanvasPage, EditorDocument } from "../types";
import { CanvasElementView } from "./CanvasElementView";

export function normalizeBackgroundOpacity(opacity: number | undefined): number {
  if (typeof opacity !== "number" || Number.isNaN(opacity)) return 1;
  return Math.min(1, Math.max(0, opacity));
}

type Props = {
  document: EditorDocument;
  page: CanvasPage;
  widthPx: number;
  heightPx: number;
  fieldData?: Record<string, string> | null;
  isPreview?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onPointerDown?: (
    e: React.PointerEvent,
    id: string,
    mode: "move" | "resize",
    handle?: string,
  ) => void;
};

/** Renders one page at 1:1 px. Background opacity applies only to the fill layer, not elements. */
export function SheetCanvasContent({
  document,
  page,
  widthPx,
  heightPx,
  fieldData = null,
  isPreview = false,
  selectedId = null,
  onSelect,
  onPointerDown,
}: Props) {
  const sorted = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);
  const bgOpacity = normalizeBackgroundOpacity(document.background.opacity);
  const bgColor = document.background.color || "#ffffff";

  return (
    <div className="relative" style={{ width: widthPx, height: heightPx }}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ backgroundColor: bgColor, opacity: bgOpacity }}
      />
      {sorted.map((el) => (
        <CanvasElementView
          key={el.id}
          element={el}
          isSelected={selectedId === el.id}
          isPreview={isPreview}
          fieldData={fieldData}
          onSelect={() => onSelect?.(el.id)}
          onPointerDown={(e, mode, handle) => onPointerDown?.(e, el.id, mode, handle)}
        />
      ))}
    </div>
  );
}
