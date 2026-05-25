import { AlertCircle, CheckCircle2, Loader2, Printer, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageLoader } from "../../components/common/PageLoader";
import {
  useCompleteMockPaymentMutation,
  usePaymentStatusQuery,
} from "../../features/payments/hooks/usePaymentQueries";
import { useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "../../features/dashboard/api/queryKeys";
import { sheetRequestKeys } from "../../features/sheet-requests/api/queryKeys";

function sheetsPrintUrl(templateId: string) {
  return `/sheets?templateId=${encodeURIComponent(templateId)}&page=1&print=1`;
}

export function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const merchantTransactionId = searchParams.get("merchantTransactionId") ?? "";
  const isMock = searchParams.get("mock") === "1";
  const queryClient = useQueryClient();
  const mockComplete = useCompleteMockPaymentMutation();
  const [mockReady, setMockReady] = useState(!isMock);

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

  useEffect(() => {
    if (status === "completed" && sheetRequest) {
      void queryClient.invalidateQueries({ queryKey: sheetRequestKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    }
  }, [status, sheetRequest, queryClient]);

  const handlePrintSheet = () => {
    if (!sheetRequest?.templateId) return;
    navigate(sheetsPrintUrl(sheetRequest.templateId));
  };

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
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h1 className="mt-4 text-lg font-semibold text-slate-900">Payment successful</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sheet request <span className="font-medium">{sheetRequest.name}</span> was created.
        </p>
        <p className="mt-1 text-xs text-slate-500">Paid {data?.payment?.amountInr} via PhonePe</p>
        <p className="mt-3 text-xs text-slate-500">
          Print your document now, or view it later from View sheets.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handlePrintSheet}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
          >
            <Printer className="h-4 w-4" />
            Print sheet
          </button>
          <Link
            to={`/sheets?templateId=${encodeURIComponent(sheetRequest.templateId)}&page=1`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View sheets
          </Link>
        </div>
        <Link to="/" className="mt-4 inline-block text-xs font-medium text-slate-500 hover:text-brand-700">
          Back to dashboard
        </Link>
      </div>
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
