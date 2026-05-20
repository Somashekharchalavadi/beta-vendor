export function EditorLoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#006837] border-t-transparent" />
        <p className="mt-3 text-sm text-slate-600">{message ?? "Loading template…"}</p>
      </div>
    </div>
  );
}
