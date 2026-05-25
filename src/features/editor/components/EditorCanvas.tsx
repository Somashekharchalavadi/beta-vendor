import { useCallback, useEffect, useRef } from "react";
import { useEditor } from "../context/EditorContext";
import { snapValue, mmToPx } from "../utils/units";
import { SheetCanvasContent } from "./SheetCanvasContent";

const GRID = 8;
const CANVAS_MARGIN = 48;
const ZOOM_STEP = 0.08;

type DragState = {
  mode: "move" | "resize";
  id: string;
  handle?: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
};

export function EditorCanvas({ isPreview = false }: { isPreview?: boolean }) {
  const { state, dispatch, activePage, selectElement, updateElement } = useEditor();
  const dragRef = useRef<DragState | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const widthPx = mmToPx(state.doc.canvasWidthMm);
  const heightPx = mmToPx(state.doc.canvasHeightMm);
  const zoom = state.zoom;

  const setZoomClamped = useCallback(
    (next: number) => {
      dispatch({ type: "SET_ZOOM", zoom: Math.min(3, Math.max(0.25, next)) });
    },
    [dispatch],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || isPreview) return;

    const onWheel = (e: WheelEvent) => {
      if (!e.shiftKey) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoomClamped(zoom + delta);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isPreview, setZoomClamped, zoom]);

  const onCanvasPointerDown = () => {
    if (!isPreview) selectElement(null);
  };

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const scale = zoom;
      const dx = (e.clientX - drag.startX) / scale;
      const dy = (e.clientY - drag.startY) / scale;
      const snap = (v: number) => snapValue(v, GRID, state.snapToGrid);

      if (drag.mode === "move") {
        updateElement(drag.id, {
          x: snap(Math.max(0, drag.origX + dx)),
          y: snap(Math.max(0, drag.origY + dy)),
        });
      } else {
        const minSize = 16;
        let { origX: x, origY: y, origW: w, origH: h } = drag;
        const handle = drag.handle ?? "se";

        if (handle.includes("e")) w = Math.max(minSize, drag.origW + dx);
        if (handle.includes("s")) h = Math.max(minSize, drag.origH + dy);
        if (handle.includes("w")) {
          w = Math.max(minSize, drag.origW - dx);
          x = drag.origX + (drag.origW - w);
        }
        if (handle.includes("n")) {
          h = Math.max(minSize, drag.origH - dy);
          y = drag.origY + (drag.origH - h);
        }

        updateElement(drag.id, {
          x: snap(Math.max(0, x)),
          y: snap(Math.max(0, y)),
          width: snap(w),
          height: snap(h),
        });
      }
    },
    [state.snapToGrid, updateElement, zoom],
  );

  const onPointerUp = useCallback(() => {
    if (dragRef.current) {
      dragRef.current = null;
      dispatch({ type: "COMMIT_HISTORY" });
    }
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [dispatch, onPointerMove]);

  const startDrag = (e: React.PointerEvent, id: string, mode: "move" | "resize", handle?: string) => {
    const el = activePage.elements.find((x) => x.id === id);
    if (!el || el.locked) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      mode,
      id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
      origW: el.width,
      origH: el.height,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const showGrid = state.showGrid && !isPreview;
  const gridSize = GRID * zoom;

  return (
    <div
      ref={viewportRef}
      data-canvas-viewport
      className="relative min-h-0 flex-1 overflow-auto bg-[#e8ecf0]"
      onPointerDown={onCanvasPointerDown}
    >
      <div
        className="relative z-[1] flex min-h-full min-w-full items-center justify-center"
        style={{
          padding: CANVAS_MARGIN,
          minWidth: widthPx * zoom + CANVAS_MARGIN * 2,
          minHeight: heightPx * zoom + CANVAS_MARGIN * 2,
        }}
      >
        {showGrid && (
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
              backgroundSize: `${gridSize}px ${gridSize}px`,
            }}
          />
        )}
        <div
          ref={canvasRef}
          className="relative shrink-0 overflow-hidden rounded-sm shadow-2xl ring-1 ring-slate-200/80"
          style={{
            width: widthPx * zoom,
            height: heightPx * zoom,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            id="editor-canvas-export"
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: widthPx,
              height: heightPx,
              transform: `scale(${zoom})`,
            }}
          >
            <SheetCanvasContent
              document={state.doc}
              page={activePage}
              widthPx={widthPx}
              heightPx={heightPx}
              isPreview={isPreview}
              selectedId={state.selectedId}
              onSelect={selectElement}
              onPointerDown={(e, id, mode, handle) => startDrag(e, id, mode, handle)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
