import { Plus, Trash2 } from "lucide-react";
import { useEditor } from "../context/EditorContext";

export function EditorPageStrip() {
  const { state, dispatch } = useEditor();
  const { pages, activePageIndex } = { pages: state.doc.pages, activePageIndex: state.activePageIndex };

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2">
      <div className="flex gap-2 overflow-x-auto">
        {pages.map((page, index) => (
          <button
            key={page.id}
            type="button"
            onClick={() => dispatch({ type: "SET_PAGE", index })}
            className={`shrink-0 rounded border p-1 transition-colors ${
              index === activePageIndex
                ? "border-[#006837] bg-white"
                : "border-slate-200 bg-white opacity-60 hover:opacity-100"
            }`}
          >
            <div className="h-10 w-16 rounded bg-slate-100" />
            <p className="mt-1 max-w-[64px] truncate text-center text-[10px] text-slate-600">{page.name}</p>
          </button>
        ))}
        <button
          type="button"
          title="Add page"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-dashed border-slate-300 text-slate-400 hover:border-[#006837] hover:text-[#006837]"
          onClick={() => dispatch({ type: "ADD_PAGE" })}
        >
          <Plus className="h-5 w-5" />
        </button>
        {pages.length > 1 && (
          <button
            type="button"
            title="Delete current page"
            className="flex h-14 w-10 shrink-0 items-center justify-center text-red-400 hover:text-red-600"
            onClick={() => dispatch({ type: "DELETE_PAGE", index: activePageIndex })}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <span className="shrink-0 text-xs text-slate-500">
        Page {activePageIndex + 1} of {pages.length}
      </span>
    </div>
  );
}
