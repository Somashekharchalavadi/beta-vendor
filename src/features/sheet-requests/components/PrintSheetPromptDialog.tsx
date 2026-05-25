import * as Dialog from "@radix-ui/react-dialog";
import { Printer, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  templateId: string | null;
  sheetName?: string;
  onDismiss: () => void;
};

export function PrintSheetPromptDialog({ open, templateId, sheetName, onDismiss }: Props) {
  const navigate = useNavigate();

  const handlePrint = () => {
    onDismiss();
    if (templateId) {
      navigate(`/sheets?templateId=${encodeURIComponent(templateId)}&page=1&print=1`);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onDismiss();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-slate-900/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
              <Printer className="h-5 w-5 text-brand-700" />
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Dismiss"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Title className="mt-3 text-lg font-semibold text-slate-900">
            Sheet request created
          </Dialog.Title>
          <Dialog.Description className="mt-2 space-y-2 text-sm text-slate-600">
            <p>
              {sheetName
                ? `"${sheetName}" was submitted successfully. Tap Print sheet below to open the document and print it now, or dismiss to continue.`
                : "Your sheet request was submitted. Tap Print sheet below to print now, or dismiss to continue."}
            </p>
            <p className="text-xs text-slate-500">
              In the print dialog, open <span className="font-medium">More settings</span> and turn off{" "}
              <span className="font-medium">Headers and footers</span> to remove the date, site name, and
              localhost URL from the page.
            </p>
          </Dialog.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={handlePrint}
              disabled={!templateId}
              className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              Print sheet
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
