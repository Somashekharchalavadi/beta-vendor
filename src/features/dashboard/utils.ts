export function formatCount(n: number): string {
  return n.toLocaleString("en-IN");
}

export function formatWeekChange(pct: number): string {
  if (pct === 0) return "Same as last week";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct}% from last week`;
}

export function greetingForUser(name?: string): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name.split(" ")[0]}!` : `${part}!`;
}
