import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { PageLoader } from "../../components/common/PageLoader";
import { getActivityHref } from "../../features/dashboard/activityNavigation";
import type { DashboardActivity } from "../../features/dashboard/dashboardApi";
import { useNotificationsQuery } from "../../features/vendor/hooks/useVendorQueries";

export function NotificationsPage() {
  const { data, isLoading, isError, error } = useNotificationsQuery();

  if (isLoading) return <PageLoader />;

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error instanceof Error ? error.message : "Failed to load notifications"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="mt-1 text-sm text-slate-500">
          {data.unreadCount > 0
            ? `${data.unreadCount} unread from recent account activity`
            : "You're all caught up"}
        </p>
      </div>

      {data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <Bell className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm text-slate-600">No notifications yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {data.items.map((n) => {
            const href = getActivityHref({
              type: n.type as DashboardActivity["type"],
              id: n.id,
              templateId: n.templateId,
              title: n.title,
              subtitle: n.body,
              detail: n.detail,
              createdAt: "",
              timeAgo: n.timeAgo,
            });
            const inner = (
              <div className="flex items-start gap-3 px-4 py-4">
                <div
                  className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-slate-200" : "bg-brand-600"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                  <p className="text-xs text-slate-500">
                    {n.body}
                    {n.detail ? ` · ${n.detail}` : ""}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{n.timeAgo}</p>
                </div>
              </div>
            );
            return (
              <li key={n.id}>
                {href ? (
                  <Link to={href} className="block transition-colors hover:bg-slate-50">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
