import { env } from "../../config/env";
import { getStoredToken } from "../auth/authStorage";

type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; message: string };

export type DashboardActivity = {
  type: "sheet_request" | "template";
  title: string;
  subtitle: string;
  detail: string;
  createdAt: string;
  timeAgo: string;
};

export type DashboardData = {
  range: { days: number; from: string; to: string; label: string };
  stats: {
    sheetRequests: {
      total: number;
      thisWeek: number;
      lastWeek: number;
      weekChangePct: number;
      pending: number;
      processed: number;
    };
    templates: {
      total: number;
      published: number;
      drafts: number;
      archived: number;
      thisWeek: number;
    };
    totalSeats: number;
  };
  usageChart: { date: string; dateKey: string; created: number; used: number }[];
  sparkline: { v: number }[];
  recentActivity: DashboardActivity[];
  topStates: { state: string; count: number; pct: number }[];
  analytics: {
    sheetRequests: number;
    totalSeats: number;
    publishedTemplates: number;
    pendingRequests: number;
  };
};

async function parseResponse<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiSuccess<T> | ApiError;
  if (!res.ok || !("success" in body) || !body.success) {
    throw new Error("message" in body ? body.message : "Request failed");
  }
  return body.data;
}

export async function fetchDashboardApi(days = 7): Promise<DashboardData> {
  const token = getStoredToken();
  if (!token) throw new Error("Please sign in");
  return parseResponse<DashboardData>(
    await fetch(`${env.apiBaseUrl}/dashboard?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}
