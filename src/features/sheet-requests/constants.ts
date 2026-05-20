export const SEAT_OPTIONS = [
  { value: "1", label: "1 seat" },
  { value: "2", label: "2 seats" },
  { value: "5", label: "5 seats" },
  { value: "10", label: "10 seats" },
  { value: "20", label: "20 seats" },
  { value: "50", label: "50 seats" },
  { value: "100", label: "100 seats" },
  { value: "other", label: "Other (custom)" },
] as const;

export function todayDateInputValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
