import { useState, type FormEvent } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { INDIAN_STATES } from "../../../constants/indianStates";
import { PageLoader } from "../../../components/common/PageLoader";
import { useTemplatesListQuery } from "../../editor/hooks/useEditorQueries";
import { SEAT_OPTIONS, todayDateInputValue } from "../constants";
import { useCreateSheetRequestMutation } from "../hooks/useSheetRequestQueries";
import { TemplatePickerCard } from "./TemplatePickerCard";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600";
const labelClass = "mb-1 block text-xs font-medium text-slate-600";

export function CreateSheetRequestModal({ open, onClose, onSuccess }: Props) {
  const minDate = todayDateInputValue();

  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [eventDate, setEventDate] = useState(minDate);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [place, setPlace] = useState("");
  const [seatOption, setSeatOption] = useState("1");
  const [customSeatCount, setCustomSeatCount] = useState("");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: templatesData, isLoading: templatesLoading } = useTemplatesListQuery(
    { limit: 50 },
    open,
  );
  const createMutation = useCreateSheetRequestMutation();

  const templates = templatesData?.items ?? [];

  const resetForm = () => {
    setName("");
    setReason("");
    setEventDate(minDate);
    setState("");
    setDistrict("");
    setPincode("");
    setPlace("");
    setSeatOption("1");
    setCustomSeatCount("");
    setTemplateId(null);
    setFormError(null);
  };

  const handleClose = () => {
    if (createMutation.isPending) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!templateId) {
      setFormError("Please select a template");
      return;
    }
    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!state) {
      setFormError("State is required");
      return;
    }
    if (!district.trim()) {
      setFormError("District is required");
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setFormError("Pincode must be 6 digits");
      return;
    }
    if (!place.trim()) {
      setFormError("Place is required");
      return;
    }
    if (eventDate < minDate) {
      setFormError("Date must be today or a future date");
      return;
    }
    if (seatOption === "other") {
      const n = Number(customSeatCount);
      if (!Number.isInteger(n) || n < 1) {
        setFormError("Enter a valid number of seats");
        return;
      }
    }

    try {
      await createMutation.mutateAsync({
        templateId,
        name: name.trim(),
        reason: reason.trim() || undefined,
        eventDate,
        state,
        district: district.trim(),
        pincode: pincode.trim(),
        place: place.trim(),
        seatOption,
        customSeatCount: seatOption === "other" ? Number(customSeatCount) : undefined,
      });
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to submit");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-900/50"
        onClick={handleClose}
      />
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
              <FileText className="h-5 w-5 text-brand-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create sheet request</h2>
              <p className="text-xs text-slate-500">
                Details will be used to generate documents from your template
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={createMutation.isPending}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Name *</label>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Event or organization name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Reason (optional)</label>
                <textarea
                  className={`${inputClass} min-h-[72px] resize-y`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Purpose of this sheet request"
                  rows={2}
                />
              </div>
              <div>
                <label className={labelClass}>Date *</label>
                <input
                  type="date"
                  className={inputClass}
                  value={eventDate}
                  min={minDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>No. of seats *</label>
                <select
                  className={inputClass}
                  value={seatOption}
                  onChange={(e) => setSeatOption(e.target.value)}
                >
                  {SEAT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              {seatOption === "other" && (
                <div>
                  <label className={labelClass}>Custom seats *</label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    className={inputClass}
                    value={customSeatCount}
                    onChange={(e) => setCustomSeatCount(e.target.value)}
                    placeholder="Enter number"
                    required
                  />
                </div>
              )}
              <div>
                <label className={labelClass}>State *</label>
                <select
                  className={inputClass}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>District *</label>
                <input
                  className={inputClass}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Pincode *</label>
                <input
                  className={inputClass}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Place *</label>
                <input
                  className={inputClass}
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Venue or locality"
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Template *</label>
              <p className="mb-3 text-xs text-slate-500">
                Select a template — preview shows layout only (no real user data)
              </p>
              {templatesLoading && <PageLoader />}
              {!templatesLoading && templates.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                  No templates yet. Create one in the editor first.
                </p>
              )}
              {!templatesLoading && templates.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {templates.map((t) => (
                    <TemplatePickerCard
                      key={t.id}
                      template={t}
                      selected={templateId === t.id}
                      onSelect={() => setTemplateId(t.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {formError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={createMutation.isPending}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || templates.length === 0}
              className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-60"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
