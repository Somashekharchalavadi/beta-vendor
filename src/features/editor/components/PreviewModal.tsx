import { X } from "lucide-react";
import { useEditor } from "../context/EditorContext";
import { EditorCanvas } from "./EditorCanvas";

export function PreviewModal() {
  const { state, dispatch } = useEditor();
  if (!state.isPreviewOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/60">
      <div className="flex items-center justify-between bg-white px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Preview — {state.doc.title}</h2>
          <p className="text-xs text-slate-500">Sample data only. Real values come from your backend when documents are generated.</p>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-slate-100"
          onClick={() => dispatch({ type: "SET_PREVIEW", open: false })}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto p-8">
        <EditorCanvas isPreview />
      </div>
    </div>
  );
}
