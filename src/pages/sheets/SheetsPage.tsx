import { ChevronLeft, ChevronRight, FileText, LayoutTemplate } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PageLoader } from "../../components/common/PageLoader";
import { templateToDocument } from "../../features/editor/templateApi";
import { useTemplatesListQuery } from "../../features/editor/hooks/useEditorQueries";
import { useTemplateSheetsPageQuery } from "../../features/sheets/hooks/useSheetsQuery";
import { TemplateCanvasPreview } from "../../features/templates/components/TemplateCanvasPreview";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function templateOptionLabel(title: string, id: string) {
  const shortId = id.slice(-6);
  return `${title} · …${shortId}`;
}

export function SheetsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const templateId = searchParams.get("templateId") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { data: templatesData, isLoading: templatesLoading } = useTemplatesListQuery({
    limit: 50,
  });
  const templates = templatesData?.items ?? [];

  const { data, isPending, isFetching, isError, error } = useTemplateSheetsPageQuery(
    templateId || null,
    page,
  );

  const isCurrentTemplateData = data?.template?.id === templateId;
  const pageData = isCurrentTemplateData ? data : undefined;

  const handleTemplateChange = (id: string) => {
    const next = new URLSearchParams();
    if (id) {
      next.set("templateId", id);
      next.set("page", "1");
    }
    setSearchParams(next);
  };

  const setPage = (nextPage: number) => {
    if (!templateId) return;
    const next = new URLSearchParams(searchParams);
    next.set("templateId", templateId);
    next.set("page", String(Math.max(1, nextPage)));
    setSearchParams(next);
  };

  const pagination = pageData?.pagination;
  const sheet = pageData?.sheet;
  const template = pageData?.template;
  const document = template ? templateToDocument(template) : null;
  const showSheetLoader = Boolean(templateId) && (isPending || (isFetching && !isCurrentTemplateData));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">View sheets</h1>
        <p className="mt-1 text-sm text-slate-500">
          Choose a template and browse generated sheets — one sheet per page with real request data.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <label className="mb-1 block text-xs font-medium text-slate-600">Template</label>
        {templatesLoading ? (
          <p className="text-sm text-slate-500">Loading templates…</p>
        ) : templates.length === 0 ? (
          <p className="text-sm text-slate-500">
            No templates yet.{" "}
            <Link to="/editor" className="font-medium text-brand-700">
              Create one
            </Link>
          </p>
        ) : (
          <select
            value={templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full max-w-md rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
          >
            <option value="">Select a template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {templateOptionLabel(t.title, t.id)}
              </option>
            ))}
          </select>
        )}
      </div>

      {!templateId && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <LayoutTemplate className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-700">Select a template to view sheets</p>
        </div>
      )}

      {showSheetLoader && <PageLoader />}

      {templateId && isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Failed to load sheets"}
        </div>
      )}

      {templateId && !showSheetLoader && !isError && pageData && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{template?.title}</span>
              {pagination && pagination.total > 0 && (
                <>
                  {" "}
                  · Sheet {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                </>
              )}
            </p>
            {pagination && pagination.total > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrev || isFetching}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  type="button"
                  disabled={!pagination.hasNext || isFetching}
                  onClick={() => setPage(page + 1)}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {pagination?.total === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-700">No sheets for this template</p>
              <p className="mt-1 text-xs text-slate-500">
                Create a sheet request from the dashboard and select this template.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
              >
                Go to dashboard
              </Link>
            </div>
          )}

          {sheet && document && sheet.templateId === templateId && (
            <div
              key={`${templateId}-${sheet.id}-${page}`}
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
            >
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
                <TemplateCanvasPreview
                  document={document}
                  fieldData={sheet.fieldData}
                  className="min-h-[480px]"
                />
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Sheet details</h2>
                <p className="mt-1 text-xs text-slate-500">Real data from sheet request</p>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["Name", sheet.name],
                    ["Reason", sheet.reason || "—"],
                    ["Date", formatDate(sheet.eventDate)],
                    ["Place", sheet.place],
                    ["District", sheet.district],
                    ["State", sheet.state],
                    ["Pincode", sheet.pincode],
                    ["Seats", String(sheet.seatCount)],
                    ["Status", sheet.status],
                    ["Submitted", formatDate(sheet.createdAt)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-medium text-slate-500">{label}</dt>
                      <dd className="mt-0.5 font-medium text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
