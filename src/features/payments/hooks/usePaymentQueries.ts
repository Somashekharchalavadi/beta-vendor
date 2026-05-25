import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../auth/AuthContext";
import { dashboardKeys } from "../../dashboard/api/queryKeys";
import { sheetRequestKeys } from "../../sheet-requests/api/queryKeys";
import type { CreateSheetRequestPayload } from "../../sheet-requests/sheetRequestApi";
import {
  completeMockPaymentApi,
  fetchPaymentConfigApi,
  fetchPaymentStatusApi,
  initiateSheetPaymentApi,
} from "../paymentApi";

export const paymentKeys = {
  all: ["payments"] as const,
  config: () => [...paymentKeys.all, "config"] as const,
  status: (txnId: string) => [...paymentKeys.all, "status", txnId] as const,
};

export function usePaymentConfigQuery(enabled = true) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: paymentKeys.config(),
    queryFn: fetchPaymentConfigApi,
    enabled: enabled && isAuthenticated,
    staleTime: 60_000,
  });
}

export function useInitiateSheetPaymentMutation() {
  return useMutation({
    mutationFn: (payload: CreateSheetRequestPayload) => initiateSheetPaymentApi(payload),
  });
}

export function usePaymentStatusQuery(merchantTransactionId: string | null, enabled: boolean) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: paymentKeys.status(merchantTransactionId ?? ""),
    queryFn: () => fetchPaymentStatusApi(merchantTransactionId!),
    enabled: Boolean(enabled && isAuthenticated && merchantTransactionId),
    refetchInterval: (query) => {
      const status = query.state.data?.payment?.status;
      if (status === "completed" || status === "failed") return false;
      return 2000;
    },
  });
}

export function useCompleteMockPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (merchantTransactionId: string) => completeMockPaymentApi(merchantTransactionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sheetRequestKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
