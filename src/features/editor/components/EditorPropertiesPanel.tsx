import { Copy, Trash2 } from "lucide-react";
import { FONT_FAMILIES, FONT_WEIGHTS } from "../constants";
import { useEditor } from "../context/EditorContext";
import { useFieldDefinitions } from "../hooks/useFieldDefinitions";
import type { PropertiesTab } from "../types";
import { elementLabel } from "../utils/elementFactory";
import { getFieldPlaceholder } from "../utils/fieldData";
import { pxToMm } from "../utils/units";

export function EditorPropertiesPanel() {
  const { state, dispatch, selectedElement, updateElement } = useEditor();
  const { fields: bindableFields } = useFieldDefinitions();
  const el = selectedElement;

  const commit = () => dispatch({ type: "COMMIT_HISTORY" });

  const num = (v: string, fallback: number) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  };

  return (
    <aside className="flex h-full w-full flex-col">
      <div className="flex border-b border-slate-100">
        {(["design", "settings"] as PropertiesTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => dispatch({ type: "SET_PROPERTIES_TAB", tab })}
            className={`flex-1 py-3 text-xs font-medium capitalize ${
              state.propertiesTab === tab ? "border-b-2 border-[#006837] text-[#006837]" : "text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!el && (
          <p className="text-center text-sm text-slate-500 py-8">Select an element on the canvas</p>
        )}

        {el && state.propertiesTab === "design" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{elementLabel(el)}</p>
                <p className="text-xs capitalize text-slate-500">{el.type} element</p>
              </div>
            </div>

            <Section title="Position & Size">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: "X", k: "x" as const },
                  { l: "Y", k: "y" as const },
                  { l: "W", k: "width" as const },
                  { l: "H", k: "height" as const },
                  { l: "R", k: "rotation" as const },
                ].map(({ l, k }) => (
                  <div key={l}>
                    <label className="text-[10px] text-slate-500">{l}</label>
                    <input
                      className="mt-0.5 w-full rounded border border-slate-200 px-2 py-1 text-xs"
                      value={Math.round(el[k] * 10) / 10}
                      onChange={(e) => updateElement(el.id, { [k]: num(e.target.value, el[k]) })}
                      onBlur={commit}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                ≈ {pxToMm(el.width).toFixed(1)} × {pxToMm(el.height).toFixed(1)} mm
              </p>
            </Section>

            {el.type === "field" && (
              <Section title="Data field slot">
                <p className="mb-2 text-[10px] text-slate-500">
                  Pick which backend field fills this area. You cannot enter user data here.
                </p>
                <select
                  className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs"
                  value={el.fieldKey}
                  onChange={(e) => {
                    const def = bindableFields.find((f) => f.key === e.target.value);
                    updateElement(el.id, {
                      fieldKey: e.target.value,
                      label: def?.label ?? e.target.value,
                    });
                    commit();
                  }}
                >
                  {bindableFields.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 rounded-lg bg-slate-50 px-2 py-1.5 font-mono text-[10px] text-slate-600">
                  {getFieldPlaceholder(el.fieldKey ?? "", el.label)}
                </p>
              </Section>
            )}

            {(el.type === "text" || el.type === "field") && (
              <Section title={el.type === "field" ? "Field style (layout only)" : "Text style (layout only)"}>
                <select
                  className="mb-2 w-full rounded border border-slate-200 px-2 py-1.5 text-xs"
                  value={el.fontFamily}
                  onChange={(e) => {
                    updateElement(el.id, { fontFamily: e.target.value });
                    commit();
                  }}
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="rounded border border-slate-200 px-2 py-1.5 text-xs"
                    value={el.fontWeight}
                    onChange={(e) => {
                      updateElement(el.id, { fontWeight: e.target.value });
                      commit();
                    }}
                  >
                    {FONT_WEIGHTS.map((w) => (
                      <option key={w} value={w}>
                        {w === "400" ? "Regular" : w === "700" ? "Bold" : w}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="rounded border border-slate-200 px-2 py-1.5 text-xs"
                    value={el.fontSize}
                    onChange={(e) => updateElement(el.id, { fontSize: num(e.target.value, el.fontSize ?? 14) })}
                    onBlur={commit}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="color"
                    value={el.color ?? "#111827"}
                    onChange={(e) => {
                      updateElement(el.id, { color: e.target.value });
                      commit();
                    }}
                    className="h-7 w-7 rounded border border-slate-200"
                  />
                  {(["left", "center", "right"] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      className={`rounded border px-2 py-0.5 text-[10px] capitalize ${
                        el.textAlign === align ? "border-[#006837] bg-emerald-50 text-[#006837]" : "border-slate-200"
                      }`}
                      onClick={() => {
                        updateElement(el.id, { textAlign: align });
                        commit();
                      }}
                    >
                      {align}
                    </button>
                  ))}
                </div>
                {el.type === "text" && (
                  <p className="mt-2 rounded-lg bg-slate-50 px-2 py-1.5 font-mono text-[10px] text-slate-600">
                    {"{{Text}}"} — layout only; content comes from your backend.
                  </p>
                )}
              </Section>
            )}

            {(el.type === "shape" || el.type === "text" || el.type === "image") && (
              <Section title="Appearance">
                <label className="text-[10px] text-slate-500">Opacity</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round((el.opacity ?? 1) * 100)}
                  onChange={(e) => updateElement(el.id, { opacity: Number(e.target.value) / 100 })}
                  onMouseUp={commit}
                  className="mt-1 w-full"
                />
                {(el.type === "shape" || el.type === "image") && (
                  <>
                    <label className="mt-2 block text-[10px] text-slate-500">Fill / Background</label>
                    <input
                      type="color"
                      value={el.fill ?? "#006837"}
                      onChange={(e) => {
                        updateElement(el.id, { fill: e.target.value });
                        commit();
                      }}
                      className="mt-1 h-7 w-full rounded border border-slate-200"
                    />
                  </>
                )}
                {el.type === "image" && (
                  <>
                    <label className="mt-2 block text-[10px] text-slate-500">Corner Radius</label>
                    <input
                      type="number"
                      className="mt-0.5 w-full rounded border border-slate-200 px-2 py-1 text-xs"
                      value={el.borderRadius ?? 0}
                      onChange={(e) => updateElement(el.id, { borderRadius: num(e.target.value, 0) })}
                      onBlur={commit}
                    />
                  </>
                )}
              </Section>
            )}

            {el.type === "qr" && (
              <Section title="QR slot">
                <p className="text-[10px] text-slate-500">
                  QR content is generated from your backend. Canvas shows{" "}
                  <span className="font-mono">{"{{QR Code}}"}</span> while designing.
                </p>
              </Section>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700"
                onClick={() => dispatch({ type: "DUPLICATE_ELEMENT", id: el.id })}
              >
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-red-200 py-2 text-xs font-medium text-red-600"
                onClick={() => dispatch({ type: "DELETE_ELEMENT", id: el.id })}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        )}

        {el && state.propertiesTab === "settings" && (
          <div className="space-y-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={el.locked ?? false}
                onChange={(e) => {
                  updateElement(el.id, { locked: e.target.checked });
                  commit();
                }}
              />
              Lock element
            </label>
            <p className="text-xs text-slate-500">Locked elements cannot be moved or resized.</p>
            {el.type === "shape" && (
              <>
                <label className="text-[10px] text-slate-500">Stroke width</label>
                <input
                  type="number"
                  className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                  value={el.strokeWidth ?? 0}
                  onChange={(e) => updateElement(el.id, { strokeWidth: num(e.target.value, 0) })}
                  onBlur={commit}
                />
                <label className="text-[10px] text-slate-500">Stroke color</label>
                <input
                  type="color"
                  value={el.stroke ?? "#000000"}
                  onChange={(e) => {
                    updateElement(el.id, { stroke: e.target.value });
                    commit();
                  }}
                  className="h-7 w-full rounded border"
                />
              </>
            )}
          </div>
        )}

      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-800">{title}</p>
      {children}
    </div>
  );
}
