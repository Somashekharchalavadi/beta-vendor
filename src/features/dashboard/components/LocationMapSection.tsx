import { useMemo, useState } from "react";
import { scaleSqrt } from "d3-scale";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { normalizeIndiaStateKey } from "../../../constants/indiaMapAliases";
import {
  INDIA_MAP_CENTER,
  INDIA_MAP_SCALE,
  INDIA_STATE_CENTROIDS,
} from "../../../constants/indiaStateCentroids";

const WORLD_GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MAP_COLORS = {
  india: "#d1fae5",
  indiaStroke: "#059669",
  marker: "#059669",
  markerHover: "#047857",
  empty: "#e2e8f0",
};

type StateStat = { state: string; count: number; pct: number };

type Props = {
  topStates: StateStat[];
};

export function LocationMapSection({ topStates }: Props) {
  const [hovered, setHovered] = useState<{ label: string; count: number } | null>(null);

  const countByState = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const row of topStates) {
      const key = normalizeIndiaStateKey(row.state);
      const existing = map.get(key);
      if (existing) {
        existing.count += row.count;
      } else {
        map.set(key, { label: row.state, count: row.count });
      }
    }
    return map;
  }, [topStates]);

  const maxCount = useMemo(
    () => Math.max(0, ...[...countByState.values()].map((v) => v.count)),
    [countByState],
  );

  const radiusScale = useMemo(
    () =>
      scaleSqrt()
        .domain([1, Math.max(1, maxCount)])
        .range([6, 18])
        .clamp(true),
    [maxCount],
  );

  const markers = useMemo(() => {
    const items: { label: string; count: number; coords: [number, number] }[] = [];
    for (const [key, stat] of countByState) {
      const coords = Object.entries(INDIA_STATE_CENTROIDS).find(
        ([name]) => normalizeIndiaStateKey(name) === key,
      )?.[1];
      if (coords && stat.count > 0) {
        items.push({ label: stat.label, count: stat.count, coords });
      }
    }
    return items;
  }, [countByState]);

  const hasUsage = markers.length > 0;

  return (
    <div className="flex h-full min-h-[280px] flex-col rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      <div className="mb-2">
        <p className="text-sm font-semibold text-slate-900">Usage across India</p>
        <p className="text-xs text-slate-500">
          India map with highlighted regions where sheet requests were submitted
        </p>
      </div>

      <div className="relative min-h-[260px] flex-1">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: INDIA_MAP_SCALE, center: INDIA_MAP_CENTER }}
          width={400}
          height={320}
          style={{ width: "100%", height: "auto", maxHeight: 320 }}
        >
          <Geographies geography={WORLD_GEO_URL}>
            {({ geographies }) =>
              geographies
                .filter((g) => String(g.properties?.name ?? "") === "India")
                .map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: MAP_COLORS.india,
                        stroke: MAP_COLORS.indiaStroke,
                        strokeWidth: 0.8,
                        outline: "none",
                      },
                      hover: { fill: "#a7f3d0", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
            }
          </Geographies>
          {markers.map((m) => (
            <Marker key={m.label} coordinates={m.coords}>
              <circle
                r={radiusScale(m.count)}
                fill={MAP_COLORS.marker}
                fillOpacity={0.85}
                stroke="#fff"
                strokeWidth={1.5}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered({ label: m.label, count: m.count })}
                onMouseLeave={() => setHovered(null)}
              />
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div className="mt-2 min-h-[2rem] border-t border-slate-200/80 pt-2 text-center text-xs text-slate-600">
        {hovered ? (
          <span>
            <span className="font-semibold text-slate-900">{hovered.label}</span>
            {" · "}
            {hovered.count} sheet request{hovered.count === 1 ? "" : "s"}
          </span>
        ) : hasUsage ? (
          <span>Hover a green dot for state details</span>
        ) : (
          <span>Submit sheet requests with state info to see regional usage</span>
        )}
      </div>

      {hasUsage && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {markers.slice(0, 5).map((m) => (
            <span
              key={m.label}
              className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 shadow-sm"
            >
              {m.label} ({m.count})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
