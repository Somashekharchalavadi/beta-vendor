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
      className={`flex h-full shrink-0 flex-col bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? "w-20" : "w-65"
        }`}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-100 relative">
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "gap-2"
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
      <nav className="flex-1 space-y-1  px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `group relative flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-colors ${collapsed ? "justify-center" : "gap-3"
              } ${isActive
                ? "bg-brand-800 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {/* Icon */}
            <item.icon className="h-5 w-5 shrink-0" />

            {/* Label */}
            {!collapsed && (
              <span className="flex-1">
                {item.label}
              </span>
            )}

            {/* Badge */}
            {!collapsed && item.badge != null && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 px-1.5 text-[11px] font-semibold text-slate-600 in-[.bg-brand-800_&]:bg-white/20 in-[.bg-brand-800_&]:text-white">
                {item.badge}
              </span>
            )}

            {/* Tooltip */}
            {collapsed && (
              <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 -translate-y-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                <div className="relative whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2  text-xs font-medium text-slate-700 shadow-sm">
                  {item.label}

                  {/* Arrow */}
                  <div className="absolute left-[-5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-l border-slate-200 bg-white" />
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-2">
        <Link
          to="/support"
          className={`group relative flex rounded-xl p-3 transition hover:bg-slate-50 ${collapsed
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
            <>
              <ChevronRight className="h-5 w-5 text-slate-400" />

              {/* Tooltip */}
              <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 -translate-y-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                <div className="relative whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
                  Support

                  <div className="absolute left-[-5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-l border-slate-200 bg-white" />
                </div>
              </div>
            </>
          )}
        </Link>
      </div>
    </aside>
  );
}