import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Grid3X3,
  Magnet,
  Maximize2,
  Minus,
  Plus,
} from "lucide-react";
import { useEditor } from "../context/EditorContext";
import type { TextAlign } from "../types";
import { computeFitZoom } from "../utils/fitZoom";

export function EditorToolbar() {
  const { state, dispatch, selectedElement, updateElement } = useEditor();

  const setAlign = (align: TextAlign) => {
    if (!selectedElement || (selectedElement.type !== "text" && selectedElement.type !== "field")) return;
    updateElement(selectedElement.id, { textAlign: align });
    dispatch({ type: "COMMIT_HISTORY" });
  };

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
      <button
        type="button"
        title="Align left"
        className={`rounded p-1 ${selectedElement?.textAlign === "left" ? "bg-emerald-50 text-[#006837]" : "text-slate-400"}`}
        onClick={() => setAlign("left")}
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Align center"
        className={`rounded p-1 ${selectedElement?.textAlign === "center" ? "bg-emerald-50 text-[#006837]" : "text-slate-400"}`}
        onClick={() => setAlign("center")}
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Align right"
        className={`rounded p-1 ${selectedElement?.textAlign === "right" ? "bg-emerald-50 text-[#006837]" : "text-slate-400"}`}
        onClick={() => setAlign("right")}
      >
        <AlignRight className="h-4 w-4" />
      </button>
      <span className="mx-2 h-4 w-px bg-slate-200" />
      <button
        type="button"
        title="Toggle grid"
        className={`rounded p-1 ${state.showGrid ? "bg-emerald-50 text-[#006837]" : "text-slate-400"}`}
        onClick={() => dispatch({ type: "TOGGLE_GRID" })}
      >
        <Grid3X3 className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Snap to grid"
        className={`rounded p-1 ${state.snapToGrid ? "bg-emerald-50 text-[#006837]" : "text-slate-400"}`}
        onClick={() => dispatch({ type: "TOGGLE_SNAP" })}
      >
        <Magnet className="h-4 w-4" />
      </button>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          title="Fit canvas to screen"
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          onClick={() => {
            const el = document.querySelector("[data-canvas-viewport]");
            if (el instanceof HTMLElement) {
              dispatch({
                type: "SET_ZOOM",
                zoom: computeFitZoom(
                  state.doc.canvasWidthMm,
                  state.doc.canvasHeightMm,
                  el.clientWidth,
                  el.clientHeight,
                ),
              });
            }
          }}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Fit
        </button>
        <button
          type="button"
          className="rounded p-1 text-slate-500 hover:bg-slate-100"
          onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom - 0.1 })}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[48px] text-center text-xs text-slate-600">{Math.round(state.zoom * 100)}%</span>
        <button
          type="button"
          className="rounded p-1 text-slate-500 hover:bg-slate-100"
          onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom + 0.1 })}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
