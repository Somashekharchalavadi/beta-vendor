import { useEffect, useState } from "react";

export function useDistrictsForState(stateName: string): string[] {
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (!stateName) {
      setDistricts([]);
      return;
    }

    let cancelled = false;

    void import("country-state-city").then(({ City, State }) => {
      const iso = State.getStatesOfCountry("IN").find(
        (s) => s.name.toLowerCase() === stateName.toLowerCase(),
      )?.isoCode;
      if (!iso || cancelled) return;
      const list = City.getCitiesOfState(iso, "IN")
        .map((c) => c.name)
        .sort((a, b) => a.localeCompare(b));
      if (!cancelled) setDistricts(list);
    });

    return () => {
      cancelled = true;
    };
  }, [stateName]);

  return districts;
}
