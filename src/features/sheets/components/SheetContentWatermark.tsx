type Props = {
  /** e.g. sheet name or reference id */
  label: string;
  vendorName?: string;
};

/** Visible deterrent watermark over sheet preview (does not block OS screenshots). */
export function SheetContentWatermark({ label, vendorName }: Props) {
  const line = vendorName ? `${vendorName} · ${label}` : label;

  return (
    <div
      className="sheet-watermark pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-16 p-8 opacity-[0.14]">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="rotate-[-24deg] select-none whitespace-nowrap text-sm font-semibold tracking-wide text-slate-900"
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
