import { HelpCircle, Mail, Phone } from "lucide-react";
import { PageLoader } from "../../components/common/PageLoader";
import { useSupportQuery } from "../../features/vendor/hooks/useVendorQueries";

export function SupportPage() {
  const { data, isLoading, isError, error } = useSupportQuery();

  if (isLoading) return <PageLoader />;

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error instanceof Error ? error.message : "Failed to load support"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Support</h1>
        <p className="mt-1 text-sm text-slate-500">Get help with DocumentSheet vendor portal</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href={`mailto:${data.email}`}
          className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:bg-slate-50"
        >
          <Mail className="h-5 w-5 text-brand-700" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Email</p>
            <p className="text-xs text-slate-500">{data.email}</p>
          </div>
        </a>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <Phone className="h-5 w-5 text-brand-700" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Phone</p>
            <p className="text-xs text-slate-500">{data.phone}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600">{data.hours}</p>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-brand-700" />
          <h2 className="text-base font-semibold text-slate-900">FAQ</h2>
        </div>
        <div className="space-y-4">
          {data.faq.map((item) => (
            <div key={item.q}>
              <p className="text-sm font-medium text-slate-900">{item.q}</p>
              <p className="mt-1 text-sm text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
