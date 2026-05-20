import { useEffect, useRef, useState } from "react";
import type { CanvasPage, EditorDocument } from "../../editor/types";
import { CanvasElementView } from "../../editor/components/CanvasElementView";
import { computeFitZoom } from "../../editor/utils/fitZoom";
import { mmToPx } from "../../editor/utils/units";

type Props = {
  document: EditorDocument;
  pageIndex?: number;
  className?: string;
  fieldData?: Record<string, string> | null;
};

export function TemplateCanvasPreview({
  document,
  pageIndex = 0,
  className = "",
  fieldData = null,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  const page: CanvasPage | undefined = document.pages[pageIndex];
  const widthPx = mmToPx(document.canvasWidthMm);
  const heightPx = mmToPx(document.canvasHeightMm);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      setZoom(
        computeFitZoom(document.canvasWidthMm, document.canvasHeightMm, el.clientWidth, el.clientHeight),
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [document.canvasWidthMm, document.canvasHeightMm]);

  if (!page) {
    return (
      <div className={`flex items-center justify-center text-sm text-slate-500 ${className}`}>
        No page to preview
      </div>
    );
  }

  const sorted = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);
  const bgOpacity = document.background.opacity;

  return (
    <div
      ref={viewportRef}
      className={`flex min-h-[320px] w-full items-center justify-center overflow-auto bg-[#e8ecf0] p-8 ${className}`}
    >
      <div
        className="relative shrink-0 overflow-hidden rounded-sm shadow-2xl ring-1 ring-slate-200/80"
        style={{
          width: widthPx * zoom,
          height: heightPx * zoom,
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: widthPx,
            height: heightPx,
            transform: `scale(${zoom})`,
            backgroundColor: document.background.color,
            opacity: bgOpacity,
          }}
        >
          {sorted.map((el) => (
            <CanvasElementView
              key={el.id}
              element={el}
              isSelected={false}
              isPreview
              fieldData={fieldData}
              onSelect={() => {}}
              onPointerDown={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
