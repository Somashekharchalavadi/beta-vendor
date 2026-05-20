import { useState } from "react";
import {
  Building2,
  ChevronRight,
  Clock,
  FilePlus,
  FileStack,
  FileText,
  LayoutTemplate,
  RefreshCw,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageLoader } from "../../components/common/PageLoader";
import { StatCard } from "../../components/common/StatCard";
import { useAuth } from "../../features/auth/AuthContext";
import { useDashboardQuery } from "../../features/dashboard/hooks/useDashboardQuery";
import {
  formatCount,
  formatWeekChange,
  greetingForUser,
} from "../../features/dashboard/utils";
import type { DashboardActivity } from "../../features/dashboard/dashboardApi";
import { CreateSheetRequestModal } from "../../features/sheet-requests/components/CreateSheetRequestModal";
import { useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "../../features/dashboard/api/queryKeys";
import { LocationMapSection } from "../../features/dashboard/components/LocationMapSection";

const RANGE_OPTIONS = [
  { days: 7, label: "Last 7 days" },
  { days: 14, label: "Last 14 days" },
  { days: 30, label: "Last 30 days" },
] as const;

const ACTIVITY_STYLES: Record<
  DashboardActivity["type"],
  { icon: typeof FileText; color: string }
> = {
  sheet_request: { icon: FileText, color: "bg-blue-100 text-blue-700" },
  template: { icon: LayoutTemplate, color: "bg-emerald-100 text-emerald-700" },
};

function MiniSparkline({ data }: { data: { v: number }[] }) {
  if (!data.length) {
    return <div className="mt-3 h-10 rounded-lg bg-slate-50" />;
  }
  return (
    <div className="mt-3">
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={data}>
          <Area type="monotone" dataKey="v" stroke="#059669" fill="#d1fae5" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [days, setDays] = useState(7);
  const [sheetModalOpen, setSheetModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardQuery(days);

  const handleSheetSuccess = () => {
    setSuccessMessage(
      "Sheet request submitted successfully. Dashboard stats will update shortly.",
    );
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-700">
          {error instanceof Error ? error.message : "Failed to load dashboard"}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, usageChart, sparkline, recentActivity, topStates, analytics, range } = data;
  const sheetChangePositive = stats.sheetRequests.weekChangePct >= 0;

  const quickActions = [
    {
      icon: FileStack,
      title: "View sheets",
      sub: "Browse sheets by template (1 per page)",
      onClick: () => navigate("/sheets"),
    },
    {
      icon: FilePlus,
      title: "Create sheet request",
      sub: "Submit event details for a template",
      onClick: () => setSheetModalOpen(true),
    },
    {
      icon: LayoutTemplate,
      title: "Create new template",
      sub: "Design ID cards, certificates & more",
      onClick: () => navigate("/editor"),
    },
    {
      icon: LayoutTemplate,
      title: "View templates",
      sub: `${formatCount(stats.templates.total)} saved templates`,
      onClick: () => navigate("/templates"),
    },
    {
      icon: Building2,
      title: "View analytics",
      sub: "Detailed usage reports",
      onClick: () => navigate("/analytics"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greetingForUser(user?.name)}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/sheets")}
            className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 shadow-sm hover:bg-brand-50"
          >
            <FileStack className="h-4 w-4" />
            View sheets
          </button>
          <button
            type="button"
            onClick={() => setSheetModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-900"
          >
            <FilePlus className="h-4 w-4" />
            Create sheet request
          </button>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-600 focus:outline-none"
            aria-label="Date range"
          >
            {RANGE_OPTIONS.map((o) => (
              <option key={o.days} value={o.days}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            aria-label="Refresh dashboard"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400">{range.label}</p>

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      )}

      <CreateSheetRequestModal
        open={sheetModalOpen}
        onClose={() => setSheetModalOpen(false)}
        onSuccess={handleSheetSuccess}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Sheet requests"
          value={formatCount(stats.sheetRequests.total)}
          change={formatWeekChange(stats.sheetRequests.weekChangePct)}
          changePositive={sheetChangePositive}
          extra={<MiniSparkline data={sparkline} />}
        />
        <StatCard
          title="Templates"
          value={formatCount(stats.templates.total)}
          change={
            stats.templates.thisWeek > 0
              ? `+${stats.templates.thisWeek} new this week`
              : "No new templates this week"
          }
          icon={LayoutTemplate}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Published"
          value={formatCount(stats.templates.published)}
          change={`${stats.templates.drafts} draft${stats.templates.drafts === 1 ? "" : "s"}`}
          changePositive={false}
          icon={LayoutTemplate}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total seats"
          value={formatCount(stats.totalSeats)}
          change="Across all requests"
          changePositive={false}
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Pending"
          value={formatCount(stats.sheetRequests.pending)}
          change={`${formatCount(stats.sheetRequests.processed)} processed`}
          changePositive={false}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Usage overview</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-600" /> Requests created
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" /> Processed
              </span>
            </div>
          </div>
          {usageChart.every((d) => d.created === 0 && d.used === 0) ? (
            <div className="flex h-[280px] flex-col items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
              <FileText className="mb-2 h-8 w-8 text-slate-300" />
              No activity in this period yet. Create a sheet request to get started.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={usageChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="created" stroke="#059669" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="used" stroke="#cbd5e1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Recent activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500">No recent activity yet.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((a, i) => {
                const style = ACTIVITY_STYLES[a.type];
                const Icon = style.icon;
                return (
                  <div key={`${a.type}-${a.createdAt}-${i}`} className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{a.title}</p>
                      <p className="truncate text-xs text-slate-500">
                        {a.subtitle}
                        {a.detail ? ` · ${a.detail}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">{a.timeAgo}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Summary</h2>
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                icon: FileText,
                label: "Sheet requests",
                val: formatCount(analytics.sheetRequests),
                ch: `${stats.sheetRequests.thisWeek} this week`,
              },
              {
                icon: Users,
                label: "Seats booked",
                val: formatCount(analytics.totalSeats),
                ch: "All time",
              },
              {
                icon: LayoutTemplate,
                label: "Published",
                val: formatCount(analytics.publishedTemplates),
                ch: `${stats.templates.total} total`,
              },
              {
                icon: Clock,
                label: "Pending",
                val: formatCount(analytics.pendingRequests),
                ch: `${stats.sheetRequests.processed} done`,
              },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 p-3">
                <s.icon className="mb-2 h-4 w-4 text-brand-700" />
                <p className="text-lg font-bold text-slate-900">{s.val}</p>
                <p className="text-[11px] text-slate-500">{s.label}</p>
                <p className="text-[11px] font-medium text-slate-600">{s.ch}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <LocationMapSection topStates={topStates} />
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-900">Top states</p>
              {topStates.length === 0 ? (
                <p className="text-xs text-slate-500">Submit sheet requests with state info.</p>
              ) : (
                <div className="space-y-3">
                  {topStates.map((l) => (
                    <div key={l.state}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="truncate text-slate-700">{l.state}</span>
                        <span className="ml-2 shrink-0 font-medium text-slate-900">
                          {l.pct}% ({l.count})
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-brand-600"
                          style={{ width: `${l.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Quick actions</h2>
          <div className="space-y-2">
            {quickActions.map((a) => (
              <button
                key={a.title}
                type="button"
                onClick={a.onClick}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <a.icon className="h-5 w-5 text-brand-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.sub}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
