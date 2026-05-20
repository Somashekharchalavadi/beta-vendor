import { Bell, HelpCircle, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6">
      <div className="relative mx-auto w-full max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search templates, organizations, students..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-16 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          ⌘K
        </kbd>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
        </button>
        <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
          title="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white">
            {user ? initials(user.name) : "?"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name ?? "User"}</p>
            <p className="text-xs text-slate-500">{user?.email ?? user?.mobileNumber ?? ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
