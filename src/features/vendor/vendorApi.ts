import { env } from "../../config/env";
import { parseApiResponse } from "../../lib/api/parseApiResponse";
import { getStoredToken } from "../auth/authStorage";

function authHeaders(): HeadersInit {
  const token = getStoredToken();
  if (!token) throw new Error("Please sign in");
  return { Authorization: `Bearer ${token}` };
}

export type WalletData = {
  balance: number;
  balanceFormatted: string;
  totalAdded: number;
  totalAddedFormatted: string;
  totalSpent: number;
  totalSpentFormatted: string;
  sheetsUsed: number;
  sheetsRemaining: number;
  costPerSheet: number;
  costPerSheetFormatted: string;
  usageChart: { day: string; sheets: number }[];
  transactions: {
    title: string;
    amount: string;
    positive: boolean;
    time: string;
  }[];
  invoices: {
    id: string;
    date: string;
    desc: string;
    amount: string;
    status: string;
  }[];
};

export type AnalyticsData = {
  range: { days: number; label: string };
  stats: {
    sheetsCreated: number;
    sheetsUsed: number;
    templatesTotal: number;
    studentsCount: number;
    walletBalance: number;
    walletBalanceFormatted: string;
    sheetsRemaining: number;
  };
  usageChart: { date: string; created: number; used: number }[];
  weeklyComparison: { day: string; thisWeek: number; lastWeek: number }[];
  templateBreakdown: { name: string; value: number; count: number; color: string }[];
  recentActivity: {
    type: string;
    id: string;
    title: string;
    subtitle: string;
    detail: string;
    timeAgo: string;
    templateId?: string;
  }[];
  topOrganizations: { name: string; count: number; pct: number }[];
  topActions: { action: string; count: string; growth: string }[];
};

export type NotificationsData = {
  unreadCount: number;
  items: {
    id: string;
    type: string;
    title: string;
    body: string;
    detail: string;
    read: boolean;
    timeAgo: string;
    templateId?: string;
  }[];
};

export type SearchData = {
  templates: { id: string; title: string; status?: string; type: string }[];
  sheetRequests: {
    id: string;
    name: string;
    templateId?: string;
    place: string;
    state: string;
    type: string;
  }[];
  organizations: { name: string; sheetCount: number; type: string }[];
  students: {
    id: string;
    name: string;
    place: string;
    state: string;
    templateId?: string;
    type: string;
  }[];
};

async function vendorGet<T>(path: string): Promise<T> {
  return parseApiResponse<T>(
    await fetch(`${env.apiBaseUrl}/vendor${path}`, { headers: authHeaders() }),
  );
}

export async function fetchWalletApi(): Promise<WalletData> {
  return vendorGet<WalletData>("/wallet");
}

export async function fetchAnalyticsApi(days = 7): Promise<AnalyticsData> {
  return vendorGet<AnalyticsData>(`/analytics?days=${days}`);
}

export async function fetchNotificationsApi(): Promise<NotificationsData> {
  return vendorGet<NotificationsData>("/notifications");
}

export async function fetchSearchApi(q: string): Promise<SearchData> {
  return vendorGet<SearchData>(`/search?q=${encodeURIComponent(q)}&limit=30`);
}

export async function fetchOrganizationsApi(): Promise<{
  items: {
    id: string;
    name: string;
    state: string;
    sheetCount: number;
    seats: number;
    pct: number;
  }[];
  total: number;
}> {
  return vendorGet("/organizations");
}

export async function fetchStudentsApi(page = 1): Promise<{
  items: {
    id: string;
    name: string;
    place: string;
    state: string;
    district: string;
    templateTitle: string;
    seatCount: number;
    status: string;
    createdAt?: string;
  }[];
  pagination: { page: number; limit: number; total: number };
}> {
  return vendorGet(`/students?page=${page}&limit=50`);
}

export async function fetchSettingsApi(): Promise<{
  profile: Record<string, unknown>;
  plan: { name: string; sheetsRemaining: number; walletBalance: string };
}> {
  return vendorGet("/settings");
}

export async function patchSettingsApi(
  body: Record<string, unknown>,
): Promise<Awaited<ReturnType<typeof fetchSettingsApi>>> {
  return parseApiResponse(
    await fetch(`${env.apiBaseUrl}/vendor/settings`, {
      method: "PATCH",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    { notifySuccess: false, notifyToast: true },
  );
}

export async function fetchSupportApi(): Promise<{
  email: string;
  phone: string;
  hours: string;
  faq: { q: string; a: string }[];
}> {
  return vendorGet("/support");
}
