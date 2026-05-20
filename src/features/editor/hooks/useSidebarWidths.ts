import { useCallback, useState } from "react";
import { SIDEBAR_LEFT, SIDEBAR_RIGHT, SIDEBAR_STORAGE_KEY } from "../constants";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function loadWidths(): { left: number; right: number } {
  try {
    const raw = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (!raw) return { left: SIDEBAR_LEFT.default, right: SIDEBAR_RIGHT.default };
    const parsed = JSON.parse(raw) as { left?: number; right?: number };
    return {
      left: clamp(parsed.left ?? SIDEBAR_LEFT.default, SIDEBAR_LEFT.min, SIDEBAR_LEFT.max),
      right: clamp(parsed.right ?? SIDEBAR_RIGHT.default, SIDEBAR_RIGHT.min, SIDEBAR_RIGHT.max),
    };
  } catch {
    return { left: SIDEBAR_LEFT.default, right: SIDEBAR_RIGHT.default };
  }
}

export function useSidebarWidths() {
  const [widths, setWidths] = useState(loadWidths);

  const setLeftWidth = useCallback((left: number) => {
    setWidths((prev) => {
      const next = {
        left: clamp(left, SIDEBAR_LEFT.min, SIDEBAR_LEFT.max),
        right: prev.right,
      };
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setRightWidth = useCallback((right: number) => {
    setWidths((prev) => {
      const next = {
        left: prev.left,
        right: clamp(right, SIDEBAR_RIGHT.min, SIDEBAR_RIGHT.max),
      };
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetWidths = useCallback(() => {
    const next = { left: SIDEBAR_LEFT.default, right: SIDEBAR_RIGHT.default };
    setWidths(next);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
  }, []);

  return {
    leftWidth: widths.left,
    rightWidth: widths.right,
    setLeftWidth,
    setRightWidth,
    resetWidths,
    leftMin: SIDEBAR_LEFT.min,
    leftMax: SIDEBAR_LEFT.max,
    rightMin: SIDEBAR_RIGHT.min,
    rightMax: SIDEBAR_RIGHT.max,
  };
}
