import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { PageLoader } from "../../components/common/PageLoader";
import { patchSettingsApi } from "../../features/vendor/vendorApi";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingsQuery, vendorKeys } from "../../features/vendor/hooks/useVendorQueries";

export function SettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useSettingsQuery();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const profile = data?.profile as Record<string, string | number | undefined> | undefined;

  const initForm = () => {
    if (!profile) return;
    setForm({
      name: String(profile.name ?? ""),
      email: String(profile.email ?? ""),
      mobileNumber: String(profile.mobileNumber ?? ""),
      state: String(profile.state ?? ""),
      dist: String(profile.dist ?? ""),
      pincode: String(profile.pincode ?? ""),
    });
  };

  if (isLoading) return <PageLoader />;

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error instanceof Error ? error.message : "Failed to load settings"}
      </div>
    );
  }

  const values = {
    name: form.name ?? String(profile?.name ?? ""),
    email: form.email ?? String(profile?.email ?? ""),
    mobileNumber: form.mobileNumber ?? String(profile?.mobileNumber ?? ""),
    state: form.state ?? String(profile?.state ?? ""),
    dist: form.dist ?? String(profile?.dist ?? ""),
    pincode: form.pincode ?? String(profile?.pincode ?? ""),
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await patchSettingsApi(values);
      void queryClient.invalidateQueries({ queryKey: vendorKeys.settings() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Your profile and plan details</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Plan</p>
        <p className="mt-1 text-sm text-slate-600">
          {data.plan.name} · {data.plan.walletBalance} · {data.plan.sheetsRemaining} sheets remaining
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Profile</p>
        {(
          [
            ["name", "Name"],
            ["email", "Email"],
            ["mobileNumber", "Mobile"],
            ["state", "State"],
            ["dist", "District"],
            ["pincode", "Pincode"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
              value={values[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              onFocus={() => {
                if (Object.keys(form).length === 0) initForm();
              }}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </form>
    </div>
  );
}
