import { useState } from "react";
import { ArrowLeft, Edit3, LayoutTemplate, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "../../components/common/ConfirmDialog";
import { PageLoader } from "../../components/common/PageLoader";
import {
  useDeleteTemplateMutation,
  useTemplateQuery,
} from "../../features/editor/hooks/useEditorQueries";
import { TemplateCanvasPreview } from "../../features/templates/components/TemplateCanvasPreview";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-600",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [activePageIndex, setActivePageIndex] = useState(0);

  const { data, isLoading, isError, error } = useTemplateQuery(id ?? null);
  const deleteMutation = useDeleteTemplateMutation();

  const template = data?.template;
  const document = data?.document;

  const handleDelete = async () => {
    if (!id) return;
    const ok = await confirm({
      title: "Delete template",
      description: "Delete this template? This cannot be undone.",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!ok) return;
    await deleteMutation.mutateAsync(id);
    navigate("/templates");
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !template || !document) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center">
        <p className="text-sm font-medium text-red-600">
          {error instanceof Error ? error.message : "Template not found"}
        </p>
        <Link to="/templates" className="mt-4 inline-block text-sm font-medium text-brand-700">
          ← Back to templates
        </Link>
      </div>
    );
  }

  const statusClass = STATUS_STYLES[template.status ?? "draft"] ?? STATUS_STYLES.draft;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/templates")}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{template.title}</h1>
              <span className={`rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${statusClass}`}>
                {template.status ?? "draft"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {template.canvasWidthMm} × {template.canvasHeightMm} mm · Version {template.version ?? 1} · Updated{" "}
              {formatDate(template.updatedAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate(`/editor?templateId=${template.id}`)}
            className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
          >
            <Edit3 className="h-4 w-4" /> Edit in editor
          </button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {document.pages.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {document.pages.map((page, index) => (
            <button
              key={page.id}
              type="button"
              onClick={() => setActivePageIndex(index)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                index === activePageIndex
                  ? "border-brand-700 bg-emerald-50 text-brand-800"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <LayoutTemplate className="h-4 w-4 text-brand-700" />
          <span className="text-sm font-medium text-slate-700">Full template preview</span>
          <span className="text-xs text-slate-400">(sample data)</span>
        </div>
        <TemplateCanvasPreview
          document={document}
          pageIndex={activePageIndex}
          className="min-h-[min(70vh,720px)] flex-1 rounded-b-2xl"
        />
      </div>
    </div>
  );
}
