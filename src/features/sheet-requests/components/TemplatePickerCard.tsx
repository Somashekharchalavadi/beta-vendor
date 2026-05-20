import { Check } from "lucide-react";
import { templateToDocument, type TemplateRecord } from "../../editor/templateApi";
import { TemplateCanvasPreview } from "../../templates/components/TemplateCanvasPreview";

type Props = {
  template: TemplateRecord;
  selected: boolean;
  onSelect: () => void;
};

export function TemplatePickerCard({ template, selected, onSelect }: Props) {
  const document = templateToDocument(template);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full overflow-hidden rounded-xl border-2 text-left transition-all ${
        selected
          ? "border-brand-600 ring-2 ring-brand-100"
          : "border-slate-200 hover:border-brand-300"
      }`}
    >
      {selected && (
        <span className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-white">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
      <div className="pointer-events-none h-36 overflow-hidden bg-[#e8ecf0]">
        <TemplateCanvasPreview document={document} className="!min-h-0 !p-2" />
      </div>
      <div className="border-t border-slate-100 px-3 py-2">
        <p className="truncate text-sm font-semibold text-slate-900">{template.title}</p>
        <p className="text-[11px] text-slate-500">
          {template.canvasWidthMm} × {template.canvasHeightMm} mm
        </p>
      </div>
    </button>
  );
}
