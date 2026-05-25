import { useEffect, useRef, useState } from "react";
import type { CanvasPage, EditorDocument } from "../../editor/types";
import { SheetCanvasContent } from "../../editor/components/SheetCanvasContent";
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
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 8 || h < 8) return;
      setZoom(
        computeFitZoom(document.canvasWidthMm, document.canvasHeightMm, w, h),
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

  return (
    <div
      ref={viewportRef}
      className={`flex h-full min-h-[200px] w-full items-center justify-center overflow-auto bg-[#e8ecf0] p-6 ${className}`}
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
          }}
        >
          <SheetCanvasContent
            document={document}
            page={page}
            widthPx={widthPx}
            heightPx={heightPx}
            fieldData={fieldData}
            isPreview
          />
        </div>
      </div>
    </div>
  );
}
