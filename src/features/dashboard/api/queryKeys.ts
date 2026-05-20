export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (days: number) => [...dashboardKeys.all, "summary", days] as const,
};
