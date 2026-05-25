import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Grid3X3,
  Magnet,
  Maximize2,
  Minus,
  Plus,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { HintTooltip } from "../../../components/ui/tooltip";
import { useEditor } from "../context/EditorContext";
import type { TextAlign } from "../types";
import { computeFitZoom } from "../utils/fitZoom";

const ZOOM_STEP = 0.1;

function ToolbarButton({
  icon: Icon,
  label,
  tooltip,
  active,
  disabled,
  onClick,
}: {
  icon: typeof AlignLeft;
  label: string;
  tooltip: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <HintTooltip content={tooltip}>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors disabled:opacity-40 ${
          active ? "bg-emerald-50 text-[#006837]" : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="hidden md:inline">{label}</span>
      </button>
    </HintTooltip>
  );
}

export function EditorToolbar() {
  const { state, dispatch, selectedElement, updateElement } = useEditor();

  const setAlign = (align: TextAlign) => {
    if (!selectedElement || (selectedElement.type !== "text" && selectedElement.type !== "field")) return;
    updateElement(selectedElement.id, { textAlign: align });
    dispatch({ type: "COMMIT_HISTORY" });
  };

  const adjustZoom = (delta: number) => {
    dispatch({ type: "SET_ZOOM", zoom: state.zoom + delta });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-white px-3 py-2">
      <ToolbarButton
        icon={AlignLeft}
        label="Align left"
        tooltip="Align selected text to the left"
        active={selectedElement?.textAlign === "left"}
        onClick={() => setAlign("left")}
      />
      <ToolbarButton
        icon={AlignCenter}
        label="Center"
        tooltip="Align selected text to the center"
        active={selectedElement?.textAlign === "center"}
        onClick={() => setAlign("center")}
      />
      <ToolbarButton
        icon={AlignRight}
        label="Align right"
        tooltip="Align selected text to the right"
        active={selectedElement?.textAlign === "right"}
        onClick={() => setAlign("right")}
      />
      <span className="mx-1 h-5 w-px bg-slate-200" />
      <ToolbarButton
        icon={Grid3X3}
        label="Grid"
        tooltip="Show or hide the background alignment grid"
        active={state.showGrid}
        onClick={() => dispatch({ type: "TOGGLE_GRID" })}
      />
      <ToolbarButton
        icon={Magnet}
        label="Snap"
        tooltip="Snap elements to the grid when moving or resizing"
        active={state.snapToGrid}
        onClick={() => dispatch({ type: "TOGGLE_SNAP" })}
      />
      <div className="ml-auto flex flex-wrap items-center gap-1">
        <HintTooltip content="Fit the canvas to the visible area">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
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
            <Maximize2 className="h-4 w-4" />
            <span className="hidden md:inline">Fit</span>
          </button>
        </HintTooltip>
        <HintTooltip content="Zoom out (or hold Shift and scroll up on the canvas)">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
            onClick={() => adjustZoom(-ZOOM_STEP)}
          >
            <ZoomOut className="h-4 w-4" />
            <Minus className="h-3 w-3 md:hidden" />
          </button>
        </HintTooltip>
        <span className="min-w-[52px] text-center text-xs font-medium text-slate-600">
          {Math.round(state.zoom * 100)}%
        </span>
        <HintTooltip content="Zoom in (or hold Shift and scroll down on the canvas)">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
            onClick={() => adjustZoom(ZOOM_STEP)}
          >
            <ZoomIn className="h-4 w-4" />
            <Plus className="h-3 w-3 md:hidden" />
          </button>
        </HintTooltip>
      </div>
    </div>
  );
}
