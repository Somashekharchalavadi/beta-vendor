import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: boolean;
};

export function Card({ children, className = "", padding = true }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white shadow-sm ${padding ? "p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}
