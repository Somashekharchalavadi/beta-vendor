import { useEffect } from "react";
import { toast } from "sonner";
import { isSheetPrintSessionActive } from "../utils/sheetPrintSession";

export const BLOCKED_PRINT_MSG =
  "Printing is only available from the Print sheet button after creating a sheet request.";

export const BLOCKED_CAPTURE_MSG =
  "Screenshots and screen capture are restricted on this page.";

export const BLOCKED_COPY_MSG = "Copying sheet content is not allowed.";

function isPrintShortcut(e: KeyboardEvent): boolean {
  return (e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P");
}

/** macOS / Windows shortcuts we can sometimes intercept in the browser. */
function isCaptureShortcut(e: KeyboardEvent): boolean {
  if (e.key === "PrintScreen" || e.code === "PrintScreen") return true;

  if (e.metaKey && e.shiftKey) {
    const k = e.key;
    if (k === "3" || k === "4" || k === "5" || k === "s" || k === "S") return true;
  }

  if (e.ctrlKey && e.shiftKey && (e.key === "s" || e.key === "S")) return true;

  return false;
}

/**
 * Print, copy, and capture deterrents for the View sheets page.
 * Note: macOS system screenshots (⌘⇧3/4/5) are handled by the OS and cannot be fully blocked in a browser.
 */
export function useSheetPageProtection(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (isPrintShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
        toast.error(BLOCKED_PRINT_MSG);
        return;
      }

      if (isCaptureShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
        toast.error(BLOCKED_CAPTURE_MSG);
      }
    };

    const onBeforePrint = () => {
      if (!isSheetPrintSessionActive()) {
        toast.error(BLOCKED_PRINT_MSG);
      }
    };

    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error(BLOCKED_COPY_MSG);
    };

    const onCut = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error(BLOCKED_COPY_MSG);
    };

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("beforeprint", onBeforePrint);
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("cut", onCut, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("beforeprint", onBeforePrint);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("cut", onCut, true);
    };
  }, [enabled]);
}

export function blockSheetContextMenu(e: React.MouseEvent): void {
  e.preventDefault();
  toast.error("Right-click actions are disabled on this page.");
}

export function blockSheetDragStart(e: React.DragEvent): void {
  e.preventDefault();
}
