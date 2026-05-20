import { NavLink } from "react-router-dom";
import { ChevronRight, FileText, Rocket } from "lucide-react";
import { NAV_ITEMS } from "../../config/constants/navigation";

export function Sidebar() {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-800 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">DocumentSheet</p>
            <p className="text-xs text-slate-500">Vendor Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-800 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge != null && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 px-1.5 text-[11px] font-semibold text-slate-600 [.bg-brand-800_&]:bg-white/20 [.bg-brand-800_&]:text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-slate-100 p-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Wallet Balance</p>
          <p className="mt-1 text-xl font-bold text-slate-900">₹2,450.00</p>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[11px] text-slate-500">
              <span>500 sheets remaining</span>
              <span>50%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/2 rounded-full bg-brand-600" />
            </div>
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-lg bg-brand-800 py-2 text-sm font-semibold text-white hover:bg-brand-900"
          >
            Add Funds
          </button>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4">
          <p className="text-xs font-semibold text-indigo-900">Upgrade Your Plan</p>
          <p className="mt-1 text-[11px] leading-relaxed text-indigo-700/80">
            Unlock more sheets & premium features
          </p>
          <button
            type="button"
            className="mt-3 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            View Plans
          </button>
          <Rocket className="absolute -bottom-1 right-2 h-12 w-12 text-indigo-300/60" />
        </div>

        <div className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white">
            VT
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">Vendor Tech</p>
            <p className="text-xs text-slate-500">Pro Plan</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
