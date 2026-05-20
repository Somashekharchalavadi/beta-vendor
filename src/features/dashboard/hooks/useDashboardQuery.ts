import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/AuthContext";
import { dashboardKeys } from "../api/queryKeys";
import { fetchDashboardApi } from "../dashboardApi";

export function useDashboardQuery(days = 7) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: dashboardKeys.summary(days),
    queryFn: () => fetchDashboardApi(days),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}
