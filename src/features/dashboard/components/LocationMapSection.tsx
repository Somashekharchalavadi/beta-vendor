import { useMemo, useState } from "react";
import { scaleLinear } from "d3-scale";
import { ComposableMap, Geographies, Geography, Graticule, Sphere } from "react-simple-maps";

const WORLD_GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MAP_ORANGE = {
  empty: "#e2e8f0",
  low: "#ffedd5",
  high: "#ea580c",
  hover: "#c2410c",
  hoverEmpty: "#cbd5e1",
};

type StateStat = { state: string; count: number; pct: number };

type Props = {
  topStates: StateStat[];
};

function useOrangeScale(maxCount: number) {
  return useMemo(
    () =>
      scaleLinear<string>()
        .domain([0, Math.max(1, maxCount)])
        .range([MAP_ORANGE.low, MAP_ORANGE.high])
        .clamp(true),
    [maxCount],
  );
}

export function LocationMapSection({ topStates }: Props) {
  const [hovered, setHovered] = useState<{ label: string; count: number } | null>(null);

  const indiaTotal = useMemo(
    () => topStates.reduce((sum, s) => sum + s.count, 0),
    [topStates],
  );
  const maxCount = useMemo(() => Math.max(0, indiaTotal), [indiaTotal]);
  const colorScale = useOrangeScale(maxCount);
  const hasData = topStates.length > 0;

  return (
    <div className="flex h-full min-h-[280px] flex-col rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      <div className="mb-2">
        <p className="text-sm font-semibold text-slate-900">Locations</p>
      </div>

      <div className="relative min-h-[260px]">
        {!hasData ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-slate-600">No location data yet</p>
            <p className="mt-1 max-w-[200px] text-xs text-slate-500">
              Sheet requests with state will appear on the map
            </p>
          </div>
        ) : (
          <ComposableMap
            projectionConfig={{ scale: 140 }}
            width={400}
            height={280}
            style={{ width: "100%", height: "auto", maxHeight: 280 }}
          >
            <Sphere stroke="#e2e8f0" strokeWidth={0.5} fill="#fffbeb" />
            <Graticule stroke="#e2e8f0" strokeWidth={0.3} />
            <Geographies geography={WORLD_GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = String(geo.properties?.name ?? "");
                  const isIndia = name === "India";
                  const count = isIndia ? indiaTotal : 0;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (isIndia) setHovered({ label: "India", count: indiaTotal });
                      }}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        default: {
                          fill: isIndia && count > 0 ? colorScale(count) : MAP_ORANGE.empty,
                          stroke: "#ffffff",
                          strokeWidth: 0.4,
                          outline: "none",
                        },
                        hover: {
                          fill: isIndia ? MAP_ORANGE.hover : MAP_ORANGE.hoverEmpty,
                          stroke: "#ffffff",
                          strokeWidth: 0.5,
                          outline: "none",
                          cursor: isIndia ? "pointer" : "default",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        )}
      </div>

      <div className="mt-2 min-h-[2rem] border-t border-slate-200/80 pt-2 text-center text-xs text-slate-600">
        {hovered ? (
          <span>
            <span className="font-semibold text-slate-900">{hovered.label}</span>
            {" · "}
            {hovered.count} sheet request{hovered.count === 1 ? "" : "s"}
          </span>
        ) : hasData ? (
          <span>Hover India for details</span>
        ) : null}
      </div>

      {hasData && maxCount > 0 && (
        <div className="mt-1 flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <span>Low</span>
          <div
            className="h-2 w-24 rounded-full"
            style={{
              background: `linear-gradient(to right, ${MAP_ORANGE.low}, ${MAP_ORANGE.high})`,
            }}
          />
          <span>High</span>
        </div>
      )}
    </div>
  );
}
