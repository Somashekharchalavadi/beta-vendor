import {
  Bell,
  ChevronDown,
  CreditCard,
  HelpCircle,
  Loader2,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
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

  const [loggingOut, setLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.getElementById("global-search-input");
        input?.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      toast.error(
        "Could not complete logout. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    const q = searchQuery.trim();

    if (!q) return;

    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="flex h-18 shrink-0 items-center gap-4 bg-white px-6">
      {/* Search */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative mx-auto w-full max-w-xl flex-1"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id="global-search-input"
          type="search"
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Search templates, organizations, students..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-16 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />

        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          ⌘K
        </kbd>
      </form>

      <div className="flex items-center gap-3">
        {/* Notification */}
        <Link
          to="/notifications"
          title="Notifications"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
        </Link>

        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() =>
              setOpenMenu((prev) => !prev)
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 transition hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white">
              {user ? initials(user.name) : "?"}
            </div>

            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {/* Dropdown */}
          {openMenu && (
            <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              {/* User info */}
              <div className="border-b border-slate-100 p-4">
                <p className="font-semibold text-slate-900">
                  {user?.name ?? "User"}
                </p>

                <p className="truncate text-sm text-slate-500">
                  {user?.email ??
                    user?.mobileNumber ??
                    ""}
                </p>
              </div>

              {/* Menu */}
              <div className="p-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>

                <Link
                  to="/billing"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <CreditCard className="h-4 w-4" />
                  Billing
                </Link>

                <Link
                  to="/support"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>

                <div className="my-2 border-t border-slate-100" />

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {loggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}

                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}