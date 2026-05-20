import { MM_TO_PX } from "../constants";

export function mmToPx(mm: number): number {
  return Math.round(mm * MM_TO_PX * 100) / 100;
}

export function pxToMm(px: number): number {
  return Math.round((px / MM_TO_PX) * 100) / 100;
}

export function snapValue(value: number, grid: number, enabled: boolean): number {
  if (!enabled || grid <= 0) return value;
  return Math.round(value / grid) * grid;
}
