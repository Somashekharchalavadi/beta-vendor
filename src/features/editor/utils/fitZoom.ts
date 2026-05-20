import { mmToPx } from "./units";

const CANVAS_PADDING = 48;

export function computeFitZoom(
  widthMm: number,
  heightMm: number,
  containerWidth: number,
  containerHeight: number,
): number {
  const widthPx = mmToPx(widthMm);
  const heightPx = mmToPx(heightMm);
  const availW = Math.max(200, containerWidth - CANVAS_PADDING * 2);
  const availH = Math.max(200, containerHeight - CANVAS_PADDING * 2);
  const fitZoom = Math.min(availW / widthPx, availH / heightPx, 2);
  return Math.round(Math.min(Math.max(fitZoom, 0.2), 1.75) * 100) / 100;
}
