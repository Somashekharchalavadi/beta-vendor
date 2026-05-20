import { useMemo, useState } from "react";
import { LayoutTemplate, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PageLoader } from "../../components/common/PageLoader";
import { StatCard } from "../../components/common/StatCard";
import { useTemplatesListQuery } from "../../features/editor/hooks/useEditorQueries";
import type { TemplateRecord } from "../../features/editor/templateApi";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-600",
};

function formatUpdatedAt(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TemplatesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading, isError, error } = useTemplatesListQuery({
    limit: 50,
    search: search.trim() || undefined,
    status: statusFilter || undefined,
  });

  const items = data?.items ?? [];

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((t) => t.status === "published").length;
    const drafts = items.filter((t) => t.status === "draft").length;
    const archived = items.filter((t) => t.status === "archived").length;
    return { total, published, drafts, archived };
  }, [items]);

  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
            <p className="mt-1 text-sm text-slate-500">Manage and organize your document templates</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/editor")}
            className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
          >
            <Plus className="h-4 w-4" /> New Template
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Templates"
            value={String(stats.total)}
            change={isLoading ? "Loading…" : "From your account"}
            icon={LayoutTemplate}
            iconBg="bg-emerald-50"
            iconColor="text-brand-700"
          />
          <StatCard
            title="Published"
            value={String(stats.published)}
            change={stats.total ? `${Math.round((stats.published / stats.total) * 100)}% of total` : "—"}
            changePositive={false}
            icon={LayoutTemplate}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Drafts"
            value={String(stats.drafts)}
            changePositive={false}
            icon={LayoutTemplate}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            title="Archived"
            value={String(stats.archived)}
            changePositive={false}
            icon={LayoutTemplate}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-brand-600 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {isLoading && <PageLoader />}

        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error instanceof Error ? error.message : "Failed to load templates"}
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <LayoutTemplate className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-sm font-medium text-slate-700">No templates yet</p>
            <p className="mt-1 text-xs text-slate-500">Create your first template in the editor and save it to the server.</p>
            <button
              type="button"
              onClick={() => navigate("/editor")}
              className="mt-6 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
            >
              Create template
            </button>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: TemplateRecord }) {
  const status = template.status ?? "draft";
  const statusClass = STATUS_STYLES[status] ?? STATUS_STYLES.draft;

  return (
    <Link
      to={`/templates/${template.id}`}
      className="group block rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:border-brand-200 hover:shadow-md"
    >
      <div className="relative p-3">
        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize ${statusClass}`}>
          {status}
        </span>
        <div className="mt-3 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
          <LayoutTemplate className="h-10 w-10 text-slate-300 transition-colors group-hover:text-brand-600" />
        </div>
      </div>
      <div className="border-t border-slate-50 px-4 py-3">
        <p className="truncate text-sm font-semibold text-slate-900">{template.title}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          {template.canvasWidthMm} × {template.canvasHeightMm} mm · Updated {formatUpdatedAt(template.updatedAt)}
        </p>
      </div>
    </Link>
  );
}
