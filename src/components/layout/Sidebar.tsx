import { NavLink } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import { NAV_ITEMS } from "../../config/constants/navigation";
import { useAuth } from "../../features/auth/AuthContext";
import { useNotificationsQuery } from "../../features/vendor/hooks/useVendorQueries";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Sidebar() {
  const { user } = useAuth();
  const { data: notifications } = useNotificationsQuery();

  const navItems = NAV_ITEMS.map((item) =>
    item.path === "/notifications" && notifications
      ? { ...item, badge: notifications.unreadCount || undefined }
      : item,
  );

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
        {navItems.map((item) => (
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

      <div className="border-t border-slate-100 p-4">
        <div className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white">
            {user ? initials(user.name) : "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.name ?? "Account"}</p>
            <p className="truncate text-xs text-slate-500">{user?.email ?? user?.mobileNumber ?? ""}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
