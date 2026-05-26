import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  extra?: ReactNode;
};

export function StatCard({
  title,
  value,
  change,
  changePositive = true,
  icon: Icon,
  iconBg = "bg-emerald-50",
  iconColor = "text-brand-700",
  extra,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm relative flex flex-col justify-center">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {Icon && (
          <div className={`flex h-9 w-16 items-center justify-center rounded-tr-lg rounded-bl-lg absolute top-0 right-0 ${iconBg}`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {change && (
        <p className={`mt-1 text-xs font-medium ${changePositive ? "text-emerald-600" : "text-slate-500"}`}>
          {change}
        </p>
      )}
      {extra}
    </div>
  );
}
