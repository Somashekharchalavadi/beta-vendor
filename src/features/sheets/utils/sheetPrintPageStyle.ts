const STYLE_ID = "sheet-print-page-rules";

export type SheetPrintPageSize = {
  widthMm: number;
  heightMm: number;
};

/** Injects @page size matching the template so the sheet fits on one page. */
export function injectSheetPrintPageStyle({ widthMm, heightMm }: SheetPrintPageSize): HTMLStyleElement {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }

  const w = Math.max(10, widthMm);
  const h = Math.max(10, heightMm);

  el.textContent = `
    @page {
      size: ${w}mm ${h}mm;
      margin: 0;
    }
    @media print {
      html, body {
        width: ${w}mm !important;
        height: ${h}mm !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
    }
  `;

  return el;
}

export function removeSheetPrintPageStyle(): void {
  document.getElementById(STYLE_ID)?.remove();
}
