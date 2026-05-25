import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
};

type PendingConfirm = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const close = useCallback((result: boolean) => {
    pending?.resolve(result);
    setPending(null);
  }, [pending]);

  const value = useMemo(() => ({ confirm }), [confirm]);

  const isDanger = pending?.variant === "danger";

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <Dialog.Root
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) close(false);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[160] bg-slate-900/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[161] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isDanger ? "bg-red-50" : "bg-amber-50"
                }`}
              >
                <AlertTriangle
                  className={`h-5 w-5 ${isDanger ? "text-red-600" : "text-amber-600"}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <Dialog.Title className="text-base font-semibold text-slate-900">
                  {pending?.title}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-600">
                  {pending?.description}
                </Dialog.Description>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {pending?.cancelLabel ?? "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                  isDanger
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-brand-800 hover:bg-brand-900"
                }`}
              >
                {pending?.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return ctx.confirm;
}
