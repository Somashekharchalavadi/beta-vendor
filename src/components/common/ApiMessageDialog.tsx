import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { subscribeApiMessage } from "../../lib/api/apiFeedback";

export function ApiMessageDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return subscribeApiMessage((msg) => {
      setMessage(msg);
      setOpen(true);
    });
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[150] bg-slate-900/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[151] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-base font-semibold text-slate-900">
                Success
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-slate-600">
                {message}
              </Dialog.Description>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900"
              >
                OK
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
