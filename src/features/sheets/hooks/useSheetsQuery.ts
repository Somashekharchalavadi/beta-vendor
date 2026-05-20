import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/AuthContext";
import { sheetsKeys } from "../api/queryKeys";
import { fetchTemplateSheetsPageApi } from "../sheetsApi";

export function useTemplateSheetsPageQuery(templateId: string | null, page: number) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: sheetsKeys.page(templateId ?? "", page),
    queryFn: () => fetchTemplateSheetsPageApi(templateId!, page),
    enabled: isAuthenticated && Boolean(templateId),
    staleTime: 0,
  });
}
