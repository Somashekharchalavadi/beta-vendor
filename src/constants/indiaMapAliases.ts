/** Normalize API/dashboard state names to india-atlas geography labels. */
const ALIASES: Record<string, string> = {
  "nct of delhi": "delhi",
  delhi: "delhi",
  orissa: "odisha",
  pondicherry: "puducherry",
  "jammu & kashmir": "jammu and kashmir",
  "dadra and nagar haveli": "dadra and nagar haveli and daman and diu",
  "daman and diu": "dadra and nagar haveli and daman and diu",
};

export function normalizeIndiaStateKey(name: string): string {
  const key = name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
  return ALIASES[key] ?? key;
}

export function geoStateLabel(properties: Record<string, unknown> | null | undefined): string {
  if (!properties) return "";
  const raw =
    properties.st_nm ??
    properties.ST_NM ??
    properties.name ??
    properties.NAME_1 ??
    properties.STATE ??
    "";
  return String(raw).trim();
}
