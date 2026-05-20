import { Search } from "lucide-react";
import { useRef } from "react";
import { PRESET_SIZES } from "../constants";
import { useEditor } from "../context/EditorContext";
import { useFieldDefinitions } from "../hooks/useFieldDefinitions";
import type { ElementsTab } from "../types";
import { useUploadTemplateAssetMutation } from "../hooks/useEditorQueries";
import { createElement } from "../utils/elementFactory";
import { TEMPLATE_LIST } from "../utils/templates";

export function EditorLeftPanel() {
  const { state, dispatch, addElement, templateId } = useEditor();
  const { fields: bindableFields, categories: fieldCategories } = useFieldDefinitions();
  const uploadAssetMutation = useUploadTemplateAssetMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const { panelMode, elementsTab, fieldSearch } = state;

  const filteredBindableFields = bindableFields.filter((f) =>
    f.label.toLowerCase().includes(fieldSearch.toLowerCase()),
  );

  const addField = (key: string, label: string) => {
    addElement(createElement("field", { fieldKey: key, label }));
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      let src = dataUrl;
      if (templateId) {
        try {
          const asset = await uploadAssetMutation.mutateAsync({
            templateId,
            dataUrl,
            fileName: file.name,
          });
          src = asset.url;
        } catch {
          /* fallback to data URL in uploads list */
        }
      }
      dispatch({ type: "ADD_UPLOAD", src });
      addElement(createElement("image", { src, width: 100, height: 100 }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const panelTitle: Record<string, string> = {
    templates: "Templates",
    elements: "Elements",
    text: "Text",
    images: "Images",
    qr: "QR Code",
    shapes: "Shapes",
    uploads: "Uploads",
    layers: "Layers",
  };

  return (
    <aside className="flex h-full w-full flex-col">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-bold text-slate-900">{panelTitle[panelMode]}</h2>

        {panelMode === "elements" && (
          <>
            <div className="mt-3 flex gap-1 rounded-lg bg-slate-100 p-1">
              {(["basic", "fields", "smart"] as ElementsTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => dispatch({ type: "SET_ELEMENTS_TAB", tab })}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium capitalize ${
                    elementsTab === tab ? "bg-emerald-50 text-[#006837]" : "text-slate-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search fields..."
                value={fieldSearch}
                onChange={(e) => dispatch({ type: "SET_FIELD_SEARCH", search: e.target.value })}
                className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-xs focus:border-[#006837] focus:outline-none"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {panelMode === "templates" && (
          <div className="space-y-2">
            {TEMPLATE_LIST.map((t) => (
              <button
                key={t.id}
                type="button"
                className="w-full rounded-xl border border-slate-100 p-3 text-left hover:border-[#006837]/40 hover:bg-emerald-50/50"
                onClick={() => {
                  if (confirm(`Load "${t.name}"? Current changes will be replaced.`)) {
                    dispatch({ type: "LOAD_TEMPLATE", doc: t.build() });
                  }
                }}
              >
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.description}</p>
              </button>
            ))}
          </div>
        )}

        {panelMode === "elements" && elementsTab === "basic" && (
          <FieldGrid
            items={["Text", "Image", "Rectangle", "Circle", "Line", "QR Code"]}
            onPick={(item) => {
              if (item === "Text") addElement(createElement("text"));
              else if (item === "Image") addElement(createElement("image"));
              else if (item === "Rectangle") addElement(createElement("shape", { shape: "rect" }));
              else if (item === "Circle") addElement(createElement("shape", { shape: "circle", width: 60, height: 60 }));
              else if (item === "Line") addElement(createElement("shape", { shape: "line", width: 120, height: 4 }));
              else if (item === "QR Code") addElement(createElement("qr"));
            }}
          />
        )}

        {panelMode === "elements" && elementsTab === "fields" && (
          <div className="space-y-5">
            <p className="text-xs text-slate-500">
              Add empty slots (e.g. Full Name, Email). Only layout and binding are saved — not user data.
            </p>
            {fieldCategories.map((cat) => {
              const items = filteredBindableFields.filter((f) => f.category === cat.id);
              if (!items.length) return null;
              return (
                <FieldGrid
                  key={cat.id}
                  title={cat.title}
                  items={items.map((i) => i.label)}
                  onPick={(label) => {
                    const def = items.find((i) => i.label === label);
                    if (def) addField(def.key, def.label);
                  }}
                />
              );
            })}
          </div>
        )}

        {panelMode === "elements" && elementsTab === "smart" && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Quick layouts</p>
            {["Header bar", "Footer bar", "Photo + QR row"].map((label) => (
              <button
                key={label}
                type="button"
                className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-left text-xs font-medium hover:bg-emerald-50"
                onClick={() => {
                  if (label === "Header bar") {
                    const el = createElement("shape", { x: 0, y: 0, width: 300, height: 48, shape: "rect" });
                    el.fill = "#006837";
                    addElement(el);
                  } else if (label === "Footer bar") {
                    const el = createElement("shape", { x: 0, y: 200, width: 300, height: 32, shape: "rect" });
                    el.fill = "#006837";
                    addElement(el);
                  } else {
                    addElement(createElement("image", { x: 20, y: 80, width: 56, height: 68 }));
                    addElement(createElement("qr", { x: 20, y: 155, width: 48, height: 48 }));
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {panelMode === "text" && (
          <button
            type="button"
            className="w-full rounded-xl bg-[#006837] py-2.5 text-sm font-semibold text-white"
            onClick={() => addElement(createElement("text"))}
          >
            + Add Text Block
          </button>
        )}

        {panelMode === "images" && (
          <div className="space-y-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
            <button
              type="button"
              className="w-full rounded-xl border-2 border-dashed border-slate-200 py-8 text-sm text-slate-600 hover:border-[#006837]"
              onClick={() => fileRef.current?.click()}
            >
              Upload Image
            </button>
            <button
              type="button"
              className="w-full rounded-lg border border-slate-200 py-2 text-xs font-medium"
              onClick={() => addElement(createElement("image"))}
            >
              Empty image placeholder
            </button>
          </div>
        )}

        {panelMode === "qr" && (
          <div className="space-y-3">
            <button
              type="button"
              className="w-full rounded-xl bg-[#006837] py-2.5 text-sm font-semibold text-white"
              onClick={() => addElement(createElement("qr"))}
            >
              + Add QR Code
            </button>
            <p className="text-xs text-slate-500">QR content is filled from your backend. Use Preview to see a sample.</p>
          </div>
        )}

        {panelMode === "shapes" && (
          <FieldGrid
            items={["Rectangle", "Circle", "Line"]}
            onPick={(item) => {
              if (item === "Rectangle") addElement(createElement("shape", { shape: "rect" }));
              else if (item === "Circle") addElement(createElement("shape", { shape: "circle", width: 60, height: 60 }));
              else addElement(createElement("shape", { shape: "line", width: 120, height: 4 }));
            }}
          />
        )}

        {panelMode === "uploads" && (
          <div className="space-y-2">
            {state.doc.uploads.length === 0 && (
              <p className="text-xs text-slate-500">No uploads yet. Add images from the Images panel.</p>
            )}
            {state.doc.uploads.map((src, i) => (
              <button
                key={i}
                type="button"
                className="block w-full overflow-hidden rounded-lg border border-slate-100"
                onClick={() => addElement(createElement("image", { src, width: 80, height: 80 }))}
              >
                <img src={src} alt="" className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>
        )}


        {panelMode === "layers" && (
          <div className="space-y-1">
            {[...state.doc.pages[state.activePageIndex].elements]
              .sort((a, b) => b.zIndex - a.zIndex)
              .map((el) => (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => dispatch({ type: "SELECT", id: el.id })}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs ${
                    state.selectedId === el.id ? "bg-emerald-50 text-[#006837]" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{el.type} — z{el.zIndex}</span>
                  <span className="flex gap-1">
                    <span
                      role="button"
                      tabIndex={0}
                      onKeyDown={() => {}}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: "REORDER_ELEMENT", id: el.id, direction: "up" });
                      }}
                      className="px-1 text-slate-400 hover:text-slate-700"
                    >
                      ↑
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onKeyDown={() => {}}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: "REORDER_ELEMENT", id: el.id, direction: "down" });
                      }}
                      className="px-1 text-slate-400 hover:text-slate-700"
                    >
                      ↓
                    </span>
                  </span>
                </button>
              ))}
          </div>
        )}

        {(panelMode === "elements" || panelMode === "templates") && (
          <div className="mt-6 space-y-4 border-t border-slate-100 pt-4">
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-700">Canvas Size (mm)</p>
              <div className="mb-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500">Width</label>
                  <input
                    type="number"
                    className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    value={state.doc.canvasWidthMm}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_CANVAS_SIZE",
                        widthMm: Number(e.target.value) || 85.6,
                        heightMm: state.doc.canvasHeightMm,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Height</label>
                  <input
                    type="number"
                    className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    value={state.doc.canvasHeightMm}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_CANVAS_SIZE",
                        widthMm: state.doc.canvasWidthMm,
                        heightMm: Number(e.target.value) || 54,
                      })
                    }
                  />
                </div>
              </div>
              <select
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                onChange={(e) => {
                  const preset = PRESET_SIZES[Number(e.target.value)];
                  if (preset) dispatch({ type: "SET_CANVAS_SIZE", widthMm: preset.w, heightMm: preset.h });
                }}
              >
                <option value="">Preset size…</option>
                {PRESET_SIZES.map((p, i) => (
                  <option key={p.label} value={i}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-700">Background</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={state.doc.background.color}
                  onChange={(e) => dispatch({ type: "SET_BACKGROUND", background: { color: e.target.value } })}
                  className="h-8 w-8 cursor-pointer rounded border border-slate-200"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(state.doc.background.opacity * 100)}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_BACKGROUND",
                      background: { opacity: Number(e.target.value) / 100 },
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function FieldGrid({
  title,
  items,
  onPick,
}: {
  title?: string;
  items: string[];
  onPick: (item: string) => void;
}) {
  return (
    <div>
      {title && <p className="mb-2 text-xs font-semibold text-slate-700">{title}</p>}
      <div className="grid grid-cols-2 gap-1.5">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPick(item)}
            className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-2 text-left text-[11px] font-medium text-slate-700 hover:border-[#006837]/30 hover:bg-emerald-50"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
