import {
  Grid3X3,
  Image,
  Layers,
  LayoutTemplate,
  QrCode,
  Shapes,
  Type,
  Upload,
} from "lucide-react";
import { NAV_ITEMS } from "../constants";
import { useEditor } from "../context/EditorContext";
import type { PanelMode } from "../types";

const ICONS: Record<PanelMode, React.ComponentType<{ className?: string }>> = {
  templates: LayoutTemplate,
  elements: Grid3X3,
  text: Type,
  images: Image,
  qr: QrCode,
  shapes: Shapes,
  uploads: Upload,
  layers: Layers,
};

export function EditorNavRail() {
  const { state, dispatch } = useEditor();

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-slate-800 bg-slate-900 py-3">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.mode];
        const active = state.panelMode === item.mode;
        return (
          <button
            key={item.mode}
            type="button"
            title={item.label}
            onClick={() => dispatch({ type: "SET_PANEL", panel: item.mode })}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              active ? "bg-[#006837] text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </aside>
  );
}
