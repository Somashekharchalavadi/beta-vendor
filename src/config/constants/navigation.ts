import {
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  FileStack,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LayoutTemplate,
  PenTool,
  Settings,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Editor", path: "/editor", icon: PenTool },
  { label: "Templates", path: "/templates", icon: LayoutTemplate },
  { label: "Sheets", path: "/sheets", icon: FileStack },
  { label: "Organizations", path: "/organizations", icon: Building2 },
  { label: "Students", path: "/students", icon: GraduationCap },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Wallet & Billing", path: "/wallet", icon: CreditCard },
  { label: "Notifications", path: "/notifications", icon: Bell, badge: 12 },
  { label: "Security", path: "/security", icon: Shield },
  { label: "Support", path: "/support", icon: HelpCircle },
  { label: "Settings", path: "/settings", icon: Settings },
];
