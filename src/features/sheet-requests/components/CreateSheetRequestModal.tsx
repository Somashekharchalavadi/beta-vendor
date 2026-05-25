import { useMemo, useState, type FormEvent } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { FormSelect } from "../../../components/common/FormSelect";
import { PageLoader } from "../../../components/common/PageLoader";
import { INDIAN_STATES } from "../../../constants/indianStates";
import { useDistrictsForState } from "../../../hooks/useDistrictsForState";
import { useTemplatesListQuery } from "../../editor/hooks/useEditorQueries";
import { SEAT_OPTIONS, todayDateInputValue } from "../constants";
import { usePaymentConfigQuery, useInitiateSheetPaymentMutation } from "../../payments/hooks/usePaymentQueries";
import { formatSheetOrderAmount } from "../../payments/paymentUtils";
import { TemplatePickerCard } from "./TemplatePickerCard";

export type SheetRequestSuccessPayload = {
  templateId: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** Called after payment + sheet creation (handled on payment result page). */
  onSuccess?: (payload: SheetRequestSuccessPayload) => void;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600";
const labelClass = "mb-1 block text-xs font-medium text-slate-600";

const stateOptions = INDIAN_STATES.map((s) => ({ value: s, label: s }));

export function CreateSheetRequestModal({ open, onClose, onSuccess: _onSuccess }: Props) {
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
  const { data: paymentConfig } = usePaymentConfigQuery(open);
  const payMutation = useInitiateSheetPaymentMutation();

  const templates = templatesData?.items ?? [];

  const districts = useDistrictsForState(state);
  const districtOptions = useMemo(
    () => districts.map((d) => ({ value: d, label: d })),
    [districts],
  );

  const seatSelectOptions = SEAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

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
    if (payMutation.isPending) return;
    resetForm();
    onClose();
  };

  const handleStateChange = (nextState: string) => {
    setState(nextState);
    setDistrict("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!templateId) {
      setFormError("Please select a template");
      return;
    }
    if (!name.trim()) {
      setFormError("Request name is required");
      return;
    }
    if (!state) {
      setFormError("State is required");
      return;
    }
    if (!district) {
      setFormError("District is required");
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setFormError("Pincode must be 6 digits");
      return;
    }
    if (!place.trim()) {
      setFormError("Venue / locality is required");
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

    const payload = {
      templateId,
      name: name.trim(),
      reason: reason.trim() || undefined,
      eventDate,
      state,
      district,
      pincode: pincode.trim(),
      place: place.trim(),
      seatOption,
      customSeatCount: seatOption === "other" ? Number(customSeatCount) : undefined,
    };

    try {
      const { payment } = await payMutation.mutateAsync(payload);
      const redirectUrl = payment.redirectUrl;
      if (!redirectUrl) {
        setFormError("Payment could not be started. Please try again.");
        return;
      }
      resetForm();
      onClose();
      window.location.href = redirectUrl;
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to start payment");
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
                Event and location details for generating documents from your template
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={payMutation.isPending}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Request name *</label>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Annual day batch A"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Reason (optional)</label>
                <textarea
                  className={`${inputClass} min-h-[72px] resize-y`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why this batch of documents is needed"
                  rows={2}
                />
              </div>
              <div>
                <label className={labelClass}>Event date *</label>
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
                <FormSelect
                  value={seatOption}
                  onValueChange={setSeatOption}
                  options={seatSelectOptions}
                  placeholder="Select seats"
                />
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
                    placeholder="Enter seat count"
                    required
                  />
                </div>
              )}
              <div>
                <label className={labelClass}>State *</label>
                <FormSelect
                  value={state}
                  onValueChange={handleStateChange}
                  options={stateOptions}
                  placeholder="Select state"
                />
              </div>
              <div>
                <label className={labelClass}>District *</label>
                {state && districtOptions.length > 0 ? (
                  <FormSelect
                    value={district}
                    onValueChange={setDistrict}
                    options={districtOptions}
                    placeholder="Select district"
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={state ? "Enter district name" : "Select state first"}
                    disabled={!state}
                    required
                  />
                )}
              </div>
              <div>
                <label className={labelClass}>Pincode *</label>
                <input
                  className={inputClass}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit PIN"
                  inputMode="numeric"
                  maxLength={6}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Venue / locality *</label>
                <input
                  className={inputClass}
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Hall, campus, or address line"
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Template *</label>
              <p className="mb-3 text-xs text-slate-500">
                Choose the layout used to generate documents for this request
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

            <div className="rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-slate-700">
              <p className="font-medium text-slate-900">Payment via PhonePe</p>
              <p className="mt-1 text-xs text-slate-600">
                ₹{(paymentConfig?.costPerSheetInr ?? 0.5).toFixed(2)} per seat · Total{" "}
                <span className="font-semibold text-brand-800">
                  {formatSheetOrderAmount(seatOption, seatOption === "other" ? Number(customSeatCount) : undefined)}
                </span>
              </p>
              {paymentConfig?.mockMode && (
                <p className="mt-1 text-xs text-amber-700">
                  Test mode: PhonePe keys not set — payment will be simulated until you add credentials.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={payMutation.isPending}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={payMutation.isPending || templates.length === 0}
              className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-60"
            >
              {payMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Pay {formatSheetOrderAmount(seatOption, seatOption === "other" ? Number(customSeatCount) : undefined)} with PhonePe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
