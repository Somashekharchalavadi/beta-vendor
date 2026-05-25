import { Building2, FileText, GraduationCap, LayoutTemplate, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PageLoader } from "../../components/common/PageLoader";
import { useVendorSearchQuery } from "../../features/vendor/hooks/useVendorQueries";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  const { data, isLoading, isError, error } = useVendorSearchQuery(q);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const query = String(form.get("q") ?? "").trim();
    if (query) setSearchParams({ q: query });
    else setSearchParams({});
  };

  const total =
    (data?.templates.length ?? 0) +
    (data?.sheetRequests.length ?? 0) +
    (data?.organizations.length ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Search</h1>
        <p className="mt-1 text-sm text-slate-500">Templates, sheet requests, venues, and more</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search templates, sheets, places..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
        >
          Search
        </button>
      </form>

      {!q && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <Search className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm text-slate-600">Enter a term to search across your account</p>
        </div>
      )}

      {q && isLoading && <PageLoader />}

      {q && isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Search failed"}
        </div>
      )}

      {q && !isLoading && !isError && data && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            {total === 0 ? `No results for “${q}”` : `${total} result${total === 1 ? "" : "s"} for “${q}”`}
          </p>

          {data.templates.length > 0 && (
            <Section title="Templates" icon={LayoutTemplate}>
              {data.templates.map((t) => (
                <ResultLink key={t.id} to={`/templates/${t.id}`} title={t.title} sub={t.status} />
              ))}
            </Section>
          )}

          {data.sheetRequests.length > 0 && (
            <Section title="Sheet requests" icon={FileText}>
              {data.sheetRequests.map((s) => (
                <ResultLink
                  key={s.id}
                  to={s.templateId ? `/sheets?templateId=${s.templateId}` : "/sheets"}
                  title={s.name}
                  sub={`${s.place}, ${s.state}`}
                />
              ))}
            </Section>
          )}

          {data.organizations.length > 0 && (
            <Section title="Venues" icon={Building2}>
              {data.organizations.map((o) => (
                <li key={o.name} className="px-4 py-3 text-sm text-slate-700">
                  {o.name} · {o.sheetCount} sheets
                </li>
              ))}
            </Section>
          )}

          {data.students.length > 0 && (
            <Section title="People / batches" icon={GraduationCap}>
              {data.students.slice(0, 10).map((s) => (
                <ResultLink
                  key={s.id}
                  to={s.templateId ? `/sheets?templateId=${s.templateId}` : "/students"}
                  title={s.name}
                  sub={`${s.place}, ${s.state}`}
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Search;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-700" />
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {children}
      </ul>
    </div>
  );
}

function ResultLink({ to, title, sub }: { to: string; title: string; sub?: string }) {
  return (
    <li>
      <Link to={to} className="block px-4 py-3 transition-colors hover:bg-slate-50">
        <p className="font-medium text-slate-900">{title}</p>
        {sub && <p className="text-xs text-slate-500 capitalize">{sub}</p>}
      </Link>
    </li>
  );
}
