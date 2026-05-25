import { useState } from "react";
import { FileText, GraduationCap, IndianRupee, LayoutTemplate } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageLoader } from "../../components/common/PageLoader";
import { StatCard } from "../../components/common/StatCard";
import { FormSelect } from "../../components/common/FormSelect";
import { useAnalyticsQuery } from "../../features/vendor/hooks/useVendorQueries";

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

export function AnalyticsPage() {
  const [days, setDays] = useState(7);
  const { data, isLoading, isError, error } = useAnalyticsQuery(days);

  if (isLoading) return <PageLoader />;

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error instanceof Error ? error.message : "Failed to load analytics"}
      </div>
    );
  }

  const { stats, usageChart, weeklyComparison, templateBreakdown, recentActivity, topOrganizations, topActions } =
    data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics overview</h1>
          <p className="mt-1 text-sm text-slate-500">{data.range.label}</p>
        </div>
        <FormSelect
          value={String(days)}
          onValueChange={(v) => setDays(Number(v))}
          options={[
            { value: "7", label: "Last 7 days" },
            { value: "14", label: "Last 14 days" },
            { value: "30", label: "Last 30 days" },
          ]}
          className="w-[160px]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Sheet requests" value={String(stats.sheetsCreated)} icon={FileText} />
        <StatCard
          title="Processed"
          value={String(stats.sheetsUsed)}
          icon={FileText}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Templates"
          value={String(stats.templatesTotal)}
          icon={LayoutTemplate}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total seats"
          value={String(stats.studentsCount)}
          icon={GraduationCap}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Wallet balance"
          value={stats.walletBalanceFormatted}
          change={`${stats.sheetsRemaining} sheets left`}
          changePositive={stats.sheetsRemaining > 0}
          icon={IndianRupee}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Usage over time" className="lg:col-span-2">
          {usageChart.length === 0 ? (
            <p className="text-sm text-slate-500">No usage in this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={usageChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="created" stroke="#059669" strokeWidth={2} name="Created" />
                <Line type="monotone" dataKey="used" stroke="#94a3b8" strokeWidth={2} name="Processed" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Template status">
          {templateBreakdown.length === 0 ? (
            <p className="text-sm text-slate-500">No templates yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={templateBreakdown} innerRadius={55} outerRadius={80} dataKey="count" paddingAngle={2}>
                    {templateBreakdown.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {templateBreakdown.map((d) => (
                  <div key={d.name} className="flex justify-between text-xs">
                    <span className="text-slate-600">{d.name}</span>
                    <span className="font-medium">{d.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly activity">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="thisWeek" fill="#059669" name="Created" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top venues (by sheet requests)">
          {topOrganizations.length === 0 ? (
            <p className="text-sm text-slate-500">No venue data yet.</p>
          ) : (
            <div className="space-y-3">
              {topOrganizations.map((o) => (
                <div key={o.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="truncate text-slate-700">{o.name}</span>
                    <span className="font-medium">{o.pct}% ({o.count})</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${o.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Key metrics">
          <div className="space-y-3">
            {topActions.map((a) => (
              <div
                key={a.action}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{a.action}</span>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{a.count}</p>
                  <p className="text-xs text-slate-500">{a.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Recent activity">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-100 p-3">
                  <p className="text-sm font-medium text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500">
                    {a.subtitle}
                    {a.detail ? ` · ${a.detail}` : ""}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{a.timeAgo}</p>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
