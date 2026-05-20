import {
  ChevronRight,
  Download,
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
import { StatCard } from "../../components/common/StatCard";

const usageData = Array.from({ length: 31 }, (_, i) => ({
  day: `May ${i + 1}`,
  sheets: Math.floor(800 + Math.random() * 400 + i * 25),
}));

const transactions = [
  { title: "Wallet Recharge", amount: "+₹1,000", positive: true, time: "2 hours ago" },
  { title: "Sheet Generated", amount: "-₹0.50", positive: false, time: "3 hours ago" },
  { title: "Wallet Recharge", amount: "+₹2,000", positive: true, time: "1 day ago" },
  { title: "Bulk Generation", amount: "-₹125", positive: false, time: "2 days ago" },
];

const invoices = [
  { id: "INV-2025-0847", date: "15 May 2025", desc: "Wallet Recharge", amount: "₹1,000", status: "Paid" },
  { id: "INV-2025-0846", date: "12 May 2025", desc: "Sheet Usage", amount: "₹245", status: "Paid" },
  { id: "INV-2025-0845", date: "08 May 2025", desc: "Wallet Recharge", amount: "₹2,000", status: "Paid" },
];

const quickActions = [
  { icon: Plus, title: "Add Funds", sub: "Top up your wallet", color: "bg-emerald-50 text-emerald-700" },
  { icon: RefreshCw, title: "Request Refund", sub: "Refund unused balance", color: "bg-blue-50 text-blue-700" },
  { icon: FileText, title: "Billing History", sub: "View all invoices", color: "bg-purple-50 text-purple-700" },
  { icon: Download, title: "Download Statement", sub: "Export as PDF", color: "bg-amber-50 text-amber-700" },
];

export function WalletPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wallet & Billing</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your balance, usage and billing information</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> Add Funds
          </button>
          <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
            Transaction History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Wallet Balance" value="₹2,450.00" change="500 sheets remaining" changePositive={false} icon={Wallet} />
        <StatCard title="Total Added" value="₹5,000.00" change="+₹1,000 this month" icon={TrendingUp} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Total Spent" value="₹2,550.00" change="-₹245 this week" changePositive={false} icon={TrendingDown} iconBg="bg-orange-50" iconColor="text-orange-600" />
        <StatCard title="Sheets Used" value="1,550" change="31% of limit" changePositive={false} icon={FileText} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Avg. Cost / Sheet" value="₹0.50" icon={IndianRupee} iconBg="bg-blue-50" iconColor="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Usage Overview</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="sheets" stroke="#059669" fill="url(#greenGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Plan & Limits</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Monthly Sheet Limit</span><span className="font-semibold">5,000</span></div>
            <div>
              <div className="flex justify-between"><span className="text-slate-500">Sheets Used</span><span className="font-semibold">1,550 (31%)</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[31%] rounded-full bg-brand-600" />
              </div>
            </div>
            <div className="flex justify-between"><span className="text-slate-500">Remaining Sheets</span><span className="font-semibold">3,450</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Plan Valid Till</span><span className="font-semibold">25 May 2025</span></div>
          </div>
          <button type="button" className="mt-5 w-full rounded-xl bg-brand-800 py-2.5 text-sm font-semibold text-white">
            Upgrade Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="grid grid-cols-2 gap-3 xl:col-span-3">
          {quickActions.map((a) => (
            <button
              key={a.title}
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm hover:bg-slate-50"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${a.color}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                <p className="text-xs text-slate-500">{a.sub}</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.map((t) => (
                <div key={t.title + t.time} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.time}</p>
                  </div>
                  <span className={`font-semibold ${t.positive ? "text-emerald-600" : "text-red-500"}`}>{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Billing Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500"><span>Opening Balance</span><span>₹1,995</span></div>
              <div className="flex justify-between text-emerald-600"><span>Total Added</span><span>+₹1,000</span></div>
              <div className="flex justify-between text-red-500"><span>Total Spent</span><span>-₹545</span></div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900"><span>Closing Balance</span><span>₹2,450</span></div>
            </div>
            <button type="button" className="mt-4 w-full rounded-xl bg-brand-800 py-2 text-sm font-semibold text-white">Add Funds</button>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <Headphones className="mb-2 h-6 w-6 text-brand-700" />
            <p className="text-sm font-semibold text-slate-900">Need help with billing?</p>
            <button type="button" className="mt-2 text-sm font-medium text-brand-700">Contact Support</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Payment Methods</h2>
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-100 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700">Pe</div>
          <div className="flex-1">
            <p className="text-sm font-semibold">PhonePe</p>
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Primary</span>
          </div>
        </div>
        <button type="button" className="w-full rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-brand-600 hover:text-brand-700">
          + Add Payment Method
        </button>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Billing History</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-5 py-3">Invoice ID</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Download</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{inv.id}</td>
                <td className="px-5 py-3 text-slate-600">{inv.date}</td>
                <td className="px-5 py-3 text-slate-600">{inv.desc}</td>
                <td className="px-5 py-3 font-medium">{inv.amount}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{inv.status}</span>
                </td>
                <td className="px-5 py-3">
                  <Download className="h-4 w-4 cursor-pointer text-slate-400 hover:text-brand-700" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
