import {
  ChevronRight,
  FileText,
  Headphones,
  IndianRupee,
  Plus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageLoader } from "../../components/common/PageLoader";
import { StatCard } from "../../components/common/StatCard";
import { useWalletQuery } from "../../features/vendor/hooks/useVendorQueries";

const quickActions = [
  { icon: Plus, title: "Add Funds", sub: "Top up your wallet", color: "bg-emerald-50 text-emerald-700" },
  { icon: RefreshCw, title: "Request Refund", sub: "Refund unused balance", color: "bg-blue-50 text-blue-700" },
  { icon: FileText, title: "Billing History", sub: "View all invoices", color: "bg-purple-50 text-purple-700" },
];

export function WalletPage() {
  const { data, isLoading, isError, error } = useWalletQuery();

  if (isLoading) return <PageLoader />;

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error instanceof Error ? error.message : "Failed to load wallet"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wallet & Billing</h1>
          <p className="mt-1 text-sm text-slate-500">
            Live balance and usage from your sheet requests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Wallet Balance"
          value={data.balanceFormatted}
          change={`${data.sheetsRemaining} sheets remaining`}
          changePositive={data.sheetsRemaining > 0}
          icon={Wallet}
        />
        <StatCard
          title="Total Added"
          value={data.totalAddedFormatted}
          change="Starting balance"
          icon={TrendingUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Total Spent"
          value={data.totalSpentFormatted}
          change={`${data.sheetsUsed} sheets`}
          changePositive={false}
          icon={TrendingDown}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Sheets Used"
          value={String(data.sheetsUsed)}
          change={`@ ${data.costPerSheetFormatted} each`}
          changePositive={false}
          icon={FileText}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Avg. Cost / Sheet"
          value={data.costPerSheetFormatted}
          icon={IndianRupee}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Usage overview</h2>
          {data.usageChart.length === 0 ? (
            <p className="text-sm text-slate-500">No sheet usage recorded yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.usageChart}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="sheets" stroke="#059669" fill="url(#greenGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Recent transactions</h2>
          {data.transactions.length === 0 ? (
            <p className="text-sm text-slate-500">No transactions yet.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-scroll">
              {data.transactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{t.title}</p>
                    <p className="text-xs text-slate-500">{t.time}</p>
                  </div>
                  <span
                    className={`font-semibold ${t.positive ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {t.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Invoices</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                  <th className="pb-2">Invoice</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-50">
                    <td className="py-2 font-medium">{inv.id}</td>
                    <td className="py-2 text-slate-600">{inv.date}</td>
                    <td className="py-2 text-slate-600">{inv.desc}</td>
                    <td className="py-2">{inv.amount}</td>
                    <td className="py-2">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Opening balance</span>
                <span>{data.totalAddedFormatted}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Total spent</span>
                <span>-{data.totalSpentFormatted.replace("₹", "₹")}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                <span>Closing balance</span>
                <span>{data.balanceFormatted}</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Quick actions</h2>
            <div className="space-y-2">
              {quickActions.map((a) => (
                <button
                  key={a.title}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.color}`}>
                    <a.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-brand-800 p-4 text-white">
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              <p className="text-sm font-semibold">Need help with billing?</p>
            </div>
            <p className="mt-1 text-xs text-emerald-100">Contact support from the Support page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
