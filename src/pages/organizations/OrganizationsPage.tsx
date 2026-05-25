import { Building2 } from "lucide-react";
import { PageLoader } from "../../components/common/PageLoader";
import { useOrganizationsQuery } from "../../features/vendor/hooks/useVendorQueries";

export function OrganizationsPage() {
  const { data, isLoading, isError, error } = useOrganizationsQuery();

  if (isLoading) return <PageLoader />;

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error instanceof Error ? error.message : "Failed to load organizations"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
        <p className="mt-1 text-sm text-slate-500">
          Venues and places derived from your sheet requests ({data.total} unique)
        </p>
      </div>

      {data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <Building2 className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm text-slate-600">No organizations yet — create sheet requests with a place.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">Venue / place</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Sheets</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3">Share</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((o) => (
                <tr key={o.id} className="border-t border-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{o.name}</td>
                  <td className="px-4 py-3 text-slate-600">{o.state}</td>
                  <td className="px-4 py-3">{o.sheetCount}</td>
                  <td className="px-4 py-3">{o.seats}</td>
                  <td className="px-4 py-3">{o.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
