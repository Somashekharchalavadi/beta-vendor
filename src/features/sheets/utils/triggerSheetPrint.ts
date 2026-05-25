import {
  activateSheetPrintSession,
  deactivateSheetPrintSession,
} from "./sheetPrintSession";
import {
  injectSheetPrintPageStyle,
  removeSheetPrintPageStyle,
  type SheetPrintPageSize,
} from "./sheetPrintPageStyle";

export type SheetPrintOptions = SheetPrintPageSize & {
  /** Shown in browser header if headers are on; use a short label or blank. */
  documentTitle?: string;
};

/** Authorized print: enables #sheet-print-root, sets exact page size, opens print dialog. */
export function triggerSheetPrint(delayMs = 800, options?: SheetPrintOptions): void {
  activateSheetPrintSession();

  const prevTitle = document.title;
  if (options) {
    injectSheetPrintPageStyle({
      widthMm: options.widthMm,
      heightMm: options.heightMm,
    });
    document.title = options.documentTitle?.trim() ? options.documentTitle.trim() : "\u00a0";
  }

  const cleanup = () => {
    deactivateSheetPrintSession();
    document.title = prevTitle;
    removeSheetPrintPageStyle();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  window.setTimeout(() => {
    window.print();
  }, delayMs);
}
