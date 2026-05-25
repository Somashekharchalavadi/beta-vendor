import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { PageLoader } from "../../components/common/PageLoader";
import { useStudentsQuery } from "../../features/vendor/hooks/useVendorQueries";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function StudentsPage() {
  const { data, isLoading, isError, error } = useStudentsQuery(1);

  if (isLoading) return <PageLoader />;

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error instanceof Error ? error.message : "Failed to load students"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Students & requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sheet requests with attendee details ({data.pagination.total} total)
        </p>
      </div>

      {data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm text-slate-600">No sheet requests yet.</p>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand-700">
            Create a sheet request
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Place</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((s) => (
                <tr key={s.id} className="border-t border-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.templateTitle}</td>
                  <td className="px-4 py-3">{s.place}</td>
                  <td className="px-4 py-3">{s.state}</td>
                  <td className="px-4 py-3">{s.seatCount}</td>
                  <td className="px-4 py-3">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
