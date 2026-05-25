import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/AuthContext";
import {
  fetchAnalyticsApi,
  fetchNotificationsApi,
  fetchOrganizationsApi,
  fetchSearchApi,
  fetchSettingsApi,
  fetchStudentsApi,
  fetchSupportApi,
  fetchWalletApi,
} from "../vendorApi";

export const vendorKeys = {
  all: ["vendor"] as const,
  wallet: () => [...vendorKeys.all, "wallet"] as const,
  analytics: (days: number) => [...vendorKeys.all, "analytics", days] as const,
  notifications: () => [...vendorKeys.all, "notifications"] as const,
  search: (q: string) => [...vendorKeys.all, "search", q] as const,
  organizations: () => [...vendorKeys.all, "organizations"] as const,
  students: (page: number) => [...vendorKeys.all, "students", page] as const,
  settings: () => [...vendorKeys.all, "settings"] as const,
  support: () => [...vendorKeys.all, "support"] as const,
};

export function useWalletQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: vendorKeys.wallet(),
    queryFn: fetchWalletApi,
    enabled: isAuthenticated,
  });
}

export function useAnalyticsQuery(days = 7) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: vendorKeys.analytics(days),
    queryFn: () => fetchAnalyticsApi(days),
    enabled: isAuthenticated,
  });
}

export function useNotificationsQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: vendorKeys.notifications(),
    queryFn: fetchNotificationsApi,
    enabled: isAuthenticated,
  });
}

export function useVendorSearchQuery(q: string) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: vendorKeys.search(q),
    queryFn: () => fetchSearchApi(q),
    enabled: isAuthenticated && q.length > 0,
  });
}

export function useOrganizationsQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: vendorKeys.organizations(),
    queryFn: fetchOrganizationsApi,
    enabled: isAuthenticated,
  });
}

export function useStudentsQuery(page = 1) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: vendorKeys.students(page),
    queryFn: () => fetchStudentsApi(page),
    enabled: isAuthenticated,
  });
}

export function useSettingsQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: vendorKeys.settings(),
    queryFn: fetchSettingsApi,
    enabled: isAuthenticated,
  });
}

export function useSupportQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: vendorKeys.support(),
    queryFn: fetchSupportApi,
    enabled: isAuthenticated,
  });
}
