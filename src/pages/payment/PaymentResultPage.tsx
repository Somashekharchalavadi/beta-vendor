import { AlertCircle, CheckCircle2, Loader2, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageLoader } from "../../components/common/PageLoader";
import { PrintSheetPromptDialog } from "../../features/sheet-requests/components/PrintSheetPromptDialog";
import type { SheetRequestSuccessPayload } from "../../features/sheet-requests/components/CreateSheetRequestModal";
import {
  useCompleteMockPaymentMutation,
  usePaymentStatusQuery,
} from "../../features/payments/hooks/usePaymentQueries";
import { useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "../../features/dashboard/api/queryKeys";
import { sheetRequestKeys } from "../../features/sheet-requests/api/queryKeys";

export function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const merchantTransactionId = searchParams.get("merchantTransactionId") ?? "";
  const isMock = searchParams.get("mock") === "1";
  const queryClient = useQueryClient();
  const mockComplete = useCompleteMockPaymentMutation();
  const [mockReady, setMockReady] = useState(!isMock);
  const [printPrompt, setPrintPrompt] = useState<SheetRequestSuccessPayload | null>(null);

  useEffect(() => {
    if (!isMock || !merchantTransactionId || mockReady) return;
    void mockComplete.mutateAsync(merchantTransactionId).then(() => setMockReady(true));
  }, [isMock, merchantTransactionId, mockReady, mockComplete]);

  const pollEnabled = Boolean(merchantTransactionId) && mockReady;
  const { data, isPending, isError, error, refetch } = usePaymentStatusQuery(
    merchantTransactionId || null,
    pollEnabled,
  );

  const status = data?.payment?.status;
  const sheetRequest = data?.sheetRequest;

  const successPayload = useMemo<SheetRequestSuccessPayload | null>(() => {
    if (!sheetRequest) return null;
    return { templateId: sheetRequest.templateId, name: sheetRequest.name };
  }, [sheetRequest]);

  useEffect(() => {
    if (status === "completed" && successPayload) {
      void queryClient.invalidateQueries({ queryKey: sheetRequestKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      setPrintPrompt(successPayload);
    }
  }, [status, successPayload, queryClient]);

  if (!merchantTransactionId) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-amber-500" />
        <p className="mt-3 font-medium text-slate-900">Invalid payment link</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand-700">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (isMock && mockComplete.isPending) {
    return <PageLoader />;
  }

  if (isPending && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-700" />
        <p className="mt-4 text-sm text-slate-600">Confirming your PhonePe payment…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error instanceof Error ? error.message : "Payment check failed"}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-lg font-semibold text-slate-900">Payment failed</h1>
        <p className="mt-2 text-sm text-slate-600">
          {data?.payment?.failureReason || "Your payment was not completed. No sheet was created."}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (status === "completed" && sheetRequest) {
    return (
      <>
        <div className="mx-auto max-w-lg rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
          <h1 className="mt-4 text-lg font-semibold text-slate-900">Payment successful</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sheet request <span className="font-medium">{sheetRequest.name}</span> was created.
          </p>
          <p className="mt-1 text-xs text-slate-500">Paid {data?.payment?.amountInr} via PhonePe</p>
          <Link
            to="/sheets"
            className="mt-6 inline-block rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            View sheets
          </Link>
        </div>
        <PrintSheetPromptDialog
          open={printPrompt !== null}
          templateId={printPrompt?.templateId ?? null}
          sheetName={printPrompt?.name}
          onDismiss={() => setPrintPrompt(null)}
        />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
      <Smartphone className="mx-auto h-10 w-10 text-brand-700" />
      <h1 className="mt-4 text-lg font-semibold text-slate-900">Waiting for payment</h1>
      <p className="mt-2 text-sm text-slate-600">
        Complete payment on PhonePe if you have not already. This page will update automatically.
      </p>
      {data?.payment?.mockMode && (
        <p className="mt-2 text-xs text-amber-700">Test mode — no real PhonePe charge.</p>
      )}
      <Loader2 className="mx-auto mt-4 h-6 w-6 animate-spin text-brand-600" />
    </div>
  );
}
