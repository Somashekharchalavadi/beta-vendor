import type { CanvasPage, EditorDocument } from "../../editor/types";
import { SheetCanvasContent } from "../../editor/components/SheetCanvasContent";
import { mmToPx } from "../../editor/utils/units";

type Props = {
  document: EditorDocument;
  fieldData: Record<string, string>;
  pageIndex?: number;
};

/** Fixed 1:1 scale preview for browser print (uses template mm size, no transform scaling). */
export function PrintableSheetPreview({ document, fieldData, pageIndex = 0 }: Props) {
  const page: CanvasPage | undefined = document.pages[pageIndex];
  const widthMm = document.canvasWidthMm;
  const heightMm = document.canvasHeightMm;
  const widthPx = mmToPx(widthMm);
  const heightPx = mmToPx(heightMm);

  if (!page) return null;

  return (
    <div
      id="sheet-print-canvas"
      className="relative overflow-hidden"
      style={{
        width: `${widthMm}mm`,
        height: `${heightMm}mm`,
        maxWidth: `${widthMm}mm`,
        maxHeight: `${heightMm}mm`,
        boxSizing: "border-box",
      }}
    >
      <SheetCanvasContent
        document={document}
        page={page}
        widthPx={widthPx}
        heightPx={heightPx}
        fieldData={fieldData}
        isPreview
      />
    </div>
  );
}
