import { useEffect, useRef } from "react";
import { useEditor } from "../context/EditorContext";
import { computeFitZoom } from "../utils/fitZoom";
import { mmToPx } from "../utils/units";

/** Auto zoom so the full canvas fits in the viewport when canvas size (mm) changes. */
export function useFitCanvasZoom(containerRef: React.RefObject<HTMLElement | null>) {
  const { state, dispatch } = useEditor();
  const lastSize = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const widthPx = mmToPx(state.doc.canvasWidthMm);
    const heightPx = mmToPx(state.doc.canvasHeightMm);

    if (lastSize.current.w === widthPx && lastSize.current.h === heightPx) return;
    lastSize.current = { w: widthPx, h: heightPx };

    const zoom = computeFitZoom(
      state.doc.canvasWidthMm,
      state.doc.canvasHeightMm,
      el.clientWidth,
      el.clientHeight,
    );
    dispatch({ type: "SET_ZOOM", zoom });
  }, [state.doc.canvasWidthMm, state.doc.canvasHeightMm, containerRef, dispatch]);
}
