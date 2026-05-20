import { Download, IndianRupee, LayoutTemplate, FileText, GraduationCap } from "lucide-react";
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
import { StatCard } from "../../components/common/StatCard";

const lineData = [
  { d: "May 12", c: 1800, u: 1400 },
  { d: "May 13", c: 2100, u: 1650 },
  { d: "May 14", c: 1950, u: 1580 },
  { d: "May 15", c: 2400, u: 1900 },
  { d: "May 16", c: 2200, u: 1750 },
  { d: "May 17", c: 2600, u: 2100 },
  { d: "May 18", c: 2800, u: 2300 },
];

const barData = [
  { day: "Mon", thisW: 400, lastW: 320 },
  { day: "Tue", thisW: 520, lastW: 410 },
  { day: "Wed", thisW: 480, lastW: 450 },
  { day: "Thu", thisW: 610, lastW: 380 },
  { day: "Fri", thisW: 550, lastW: 490 },
  { day: "Sat", thisW: 320, lastW: 280 },
  { day: "Sun", thisW: 290, lastW: 250 },
];

const donutData = [
  { name: "Student ID", value: 45, color: "#059669" },
  { name: "Employee ID", value: 20, color: "#3b82f6" },
  { name: "Certificate", value: 18, color: "#8b5cf6" },
  { name: "Letter Head", value: 12, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#94a3b8" },
];

const activities = [
  { title: "New sheet created", sub: "Student ID - Greenfield", time: "Just now", color: "bg-emerald-100 text-emerald-700" },
  { title: "Template published", sub: "Employee ID Card", time: "5m ago", color: "bg-blue-100 text-blue-700" },
  { title: "Bulk import completed", sub: "250 students", time: "12m ago", color: "bg-purple-100 text-purple-700" },
];

const topActions = [
  { action: "Sheet Generated", count: "8,765", growth: "+11.2%" },
  { action: "Template Created", count: "32", growth: "+14.8%" },
  { action: "QR Scanned", count: "12,840", growth: "+8.4%" },
  { action: "Downloaded", count: "4,521", growth: "+15.1%" },
];

const orgs = [
  { name: "Greenfield University", pct: 35, count: 4365 },
  { name: "Tech Institute", pct: 25, count: 3120 },
  { name: "City College", pct: 20, count: 2496 },
  { name: "Others", pct: 20, count: 2496 },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Track your usage, templates, and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            May 12 – May 18, 2025
          </button>
          <button type="button" className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Sheets Created" value="12,540" change="+15.3%" icon={FileText} />
        <StatCard title="Sheets Used" value="8,765" change="+11.2%" icon={FileText} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Templates Created" value="32" change="+14.8%" icon={LayoutTemplate} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Active Students" value="2,340" change="+13.5%" icon={GraduationCap} />
        <StatCard title="Wallet Balance" value="₹2,450.00" change="500 sheets remaining" changePositive={false} icon={IndianRupee} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Usage Over Time" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="d" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="c" stroke="#059669" strokeWidth={2} name="Created" />
              <Line type="monotone" dataKey="u" stroke="#94a3b8" strokeWidth={2} name="Used" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Top Templates">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={donutData} innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={2}>
                {donutData.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {donutData.map((d) => (
              <div key={d.name} className="flex justify-between text-xs">
                <span className="text-slate-600">{d.name}</span>
                <span className="font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Real-time Activity" className="lg:col-span-1">
          <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> Live
          </span>
          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.title} className="flex gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.color}`}>
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.sub}</p>
                </div>
                <p className="text-[10px] text-slate-400">{a.time}</p>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Sheets Trend Comparison" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="thisW" fill="#059669" radius={[4, 4, 0, 0]} name="This Week" />
              <Bar dataKey="lastW" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Last Week" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Top Actions">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                <th className="pb-2">Action</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topActions.map((r) => (
                <tr key={r.action} className="border-b border-slate-50">
                  <td className="py-2.5 font-medium text-slate-900">{r.action}</td>
                  <td className="py-2.5 text-slate-600">{r.count}</td>
                  <td className="py-2.5 font-medium text-emerald-600">{r.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
        <ChartCard title="Sheets by Organization">
          <div className="space-y-4">
            {orgs.map((o) => (
              <div key={o.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-800">{o.name}</span>
                  <span className="text-slate-500">{o.count} ({o.pct}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand-600" style={{ width: `${o.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Geographic Distribution" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex h-36 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">World map</div>
            <div className="space-y-2">
              {[
                { c: "India", p: 45 },
                { c: "USA", p: 20 },
                { c: "UK", p: 15 },
              ].map((l) => (
                <div key={l.c} className="flex justify-between text-sm">
                  <span>{l.c}</span>
                  <span className="font-medium">{l.p}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
        <ChartCard title="Device Breakdown">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={[
                  { n: "Desktop", v: 58 },
                  { n: "Mobile", v: 32 },
                  { n: "Tablet", v: 10 },
                ]}
                dataKey="v"
                innerRadius={40}
                outerRadius={65}
                fill="#059669"
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 text-xs">
            <p>Desktop 58%</p>
            <p>Mobile 32%</p>
            <p>Tablet 10%</p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}
