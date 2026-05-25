import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Cloud,
  Download,
  Eye,
  LayoutTemplate,
  Pencil,
  Redo2,
  Save,
  Undo2,
} from "lucide-react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "../../../components/common/ConfirmDialog";
import { HintTooltip } from "../../../components/ui/tooltip";
import { useEditor } from "../context/EditorContext";
import { sanitizeTemplateDocument } from "../utils/fieldData";

export function EditorTopBar() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { state, dispatch, canUndo, canRedo, saveToServer, saveToLocal, isSaving, templateId } = useEditor();
  const [titleEditing, setTitleEditing] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveServer = async () => {
    setSaveError(null);
    try {
      await saveToServer();
      setSaveOpen(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const goBack = async () => {
    if (!state.isSaved) {
      const leave = await confirm({
        title: "Unsaved changes",
        description: "You have unsaved changes. Leave the editor anyway?",
        confirmLabel: "Leave",
        variant: "danger",
      });
      if (!leave) return;
    }
    const from = sessionStorage.getItem("documentsheet-editor-return");
    if (from && from !== "/editor") {
      navigate(from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const exportPng = async () => {
    const node = document.getElementById("editor-canvas-export");
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: null });
    const link = document.createElement("a");
    link.download = `${state.doc.title.replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setSaveOpen(false);
  };

  const exportJson = () => {
    const template = sanitizeTemplateDocument(state.doc);
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.download = `${state.doc.title.replace(/\s+/g, "-")}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    setSaveOpen(false);
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        <HintTooltip content="Return to the previous page">
          <button
            type="button"
            onClick={() => void goBack()}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </HintTooltip>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#006837] text-white">
          <LayoutTemplate className="h-4 w-4" />
        </div>
        <span className="hidden text-sm font-bold text-slate-900 sm:inline">
          DocumentSheet <span className="font-normal text-[#006837]">Editor</span>
        </span>
        <span className="text-slate-300">|</span>
        {titleEditing ? (
          <input
            autoFocus
            className="max-w-[200px] rounded border border-slate-200 px-2 py-1 text-sm sm:max-w-xs"
            value={state.doc.title}
            onChange={(e) => dispatch({ type: "SET_TITLE", title: e.target.value })}
            onBlur={() => setTitleEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setTitleEditing(false)}
          />
        ) : (
          <button
            type="button"
            className="flex max-w-[200px] items-center gap-1 truncate text-sm text-slate-600 hover:text-slate-900 sm:max-w-xs"
            onClick={() => setTitleEditing(true)}
          >
            {state.doc.title}
            <Pencil className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 text-slate-500">
        <span className={`flex items-center gap-1 text-xs ${state.isSaved ? "text-emerald-600" : "text-amber-600"}`}>
          <Cloud className="h-3.5 w-3.5" />{" "}
          {isSaving ? "Saving…" : state.isSaved ? (templateId ? "Saved" : "Saved locally") : "Unsaved"}
        </span>
        {saveError && <span className="max-w-[120px] truncate text-xs text-red-500">{saveError}</span>}
        <HintTooltip content="Undo last change (⌘Z)">
          <button
            type="button"
            disabled={!canUndo}
            className="flex items-center gap-1 disabled:opacity-30"
            onClick={() => dispatch({ type: "UNDO" })}
          >
            <Undo2 className="h-4 w-4 hover:text-slate-700" />
            <span className="hidden text-xs lg:inline">Undo</span>
          </button>
        </HintTooltip>
        <HintTooltip content="Redo (⌘⇧Z)">
          <button
            type="button"
            disabled={!canRedo}
            className="flex items-center gap-1 disabled:opacity-30"
            onClick={() => dispatch({ type: "REDO" })}
          >
            <Redo2 className="h-4 w-4 hover:text-slate-700" />
            <span className="hidden text-xs lg:inline">Redo</span>
          </button>
        </HintTooltip>
      </div>

      <div className="flex items-center gap-2">
        <HintTooltip content="Preview the layout with sample field data">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => dispatch({ type: "SET_PREVIEW", open: true })}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </HintTooltip>
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg bg-[#006837] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#005a30]"
            onClick={() => setSaveOpen((o) => !o)}
          >
            Save Template <ChevronDown className="h-4 w-4" />
          </button>
          {saveOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSaveOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  disabled={isSaving}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 disabled:opacity-50"
                  onClick={() => void handleSaveServer()}
                >
                  <Save className="h-4 w-4" /> Save to server
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() => {
                    saveToLocal();
                    setSaveOpen(false);
                  }}
                >
                  <Save className="h-4 w-4" /> Save to browser (backup)
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={exportJson}
                >
                  <Download className="h-4 w-4" /> Export JSON
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={exportPng}
                >
                  <Download className="h-4 w-4" /> Download PNG
                </button>
              </div>
            </>
          )}
        </div>
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#006837] text-xs font-bold text-white">
          VT
        </div>
      </div>
    </header>
  );
}
