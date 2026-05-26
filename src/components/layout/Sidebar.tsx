import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { NAV_ITEMS } from "../../config/constants/navigation";
import { useNotificationsQuery } from "../../features/vendor/hooks/useVendorQueries";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const { data: notifications } = useNotificationsQuery();

  const navItems = NAV_ITEMS.map((item) =>
    item.path === "/notifications" && notifications
      ? {
          ...item,
          badge: notifications.unreadCount || undefined,
        }
      : item
  );

  return (
    <aside
      className={`flex h-full shrink-0 flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-65"
      }`}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-100 relative">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-2"
          }`}
        >
          <img
            src="/logo.png"
            alt="Document Sheet Logo"
            className="h-12 shrink-0"
          />

          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-slate-900">
                DocumentSheet
              </p>
              <p className="text-xs text-slate-500">
                Vendor Portal
              </p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-4 -bottom-4 p-2 bg-white rounded-full border border-slate-200 cursor-pointer">
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            title={collapsed ? item.label : ""}
            className={({ isActive }) =>
              `group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                collapsed
                  ? "justify-center"
                  : "gap-3"
              } ${
                isActive
                  ? "bg-brand-800 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />

            {!collapsed && (
              <span className="flex-1">
                {item.label}
              </span>
            )}

            {!collapsed && item.badge != null && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 px-1.5 text-[11px] font-semibold text-slate-600 in-[.bg-brand-800_&]:bg-white/20 in-[.bg-brand-800_&]:text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-2">
        <Link
          to="/support"
          title={collapsed ? "Support" : ""}
          className={`flex rounded-xl p-3 transition hover:bg-slate-50 ${
            collapsed
              ? "justify-center"
              : "items-center justify-between"
          }`}
        >
          {!collapsed ? (
            <>
              <span>Support</span>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </>
          ) : (
            <ChevronRight className="h-5 w-5 text-slate-400" />
          )}
        </Link>
      </div>
    </aside>
  );
}