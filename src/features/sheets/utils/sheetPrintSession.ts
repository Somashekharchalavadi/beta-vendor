/** Body class set only while an authorized sheet print is in progress. */
export const SHEET_PRINT_ACTIVE_CLASS = "sheet-print-active";

export function activateSheetPrintSession(): void {
  document.body.classList.add(SHEET_PRINT_ACTIVE_CLASS);
}

export function deactivateSheetPrintSession(): void {
  document.body.classList.remove(SHEET_PRINT_ACTIVE_CLASS);
}

export function isSheetPrintSessionActive(): boolean {
  return document.body.classList.contains(SHEET_PRINT_ACTIVE_CLASS);
}
