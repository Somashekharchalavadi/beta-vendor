import type { DashboardActivity } from "./dashboardApi";

export function getActivityHref(activity: DashboardActivity): string | null {
  if (activity.type === "sheet_request" && activity.templateId) {
    return `/sheets?templateId=${encodeURIComponent(activity.templateId)}&page=1`;
  }
  if (activity.type === "template" && activity.id) {
    return `/templates/${activity.id}`;
  }
  return null;
}
