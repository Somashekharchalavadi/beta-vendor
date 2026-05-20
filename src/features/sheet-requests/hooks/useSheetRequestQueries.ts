import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../auth/AuthContext";
import { dashboardKeys } from "../../dashboard/api/queryKeys";
import { sheetRequestKeys } from "../api/queryKeys";
import {
  createSheetRequestApi,
  listSheetRequestsApi,
  type CreateSheetRequestPayload,
} from "../sheetRequestApi";

export function useSheetRequestsListQuery(params?: { page?: number; limit?: number }) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: sheetRequestKeys.list(params),
    queryFn: () => listSheetRequestsApi(params),
    enabled: isAuthenticated,
  });
}

export function useCreateSheetRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSheetRequestPayload) => createSheetRequestApi(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sheetRequestKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
