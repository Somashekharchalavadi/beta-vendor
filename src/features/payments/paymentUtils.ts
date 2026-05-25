export const COST_PER_SHEET_INR = 0.5;
const MIN_AMOUNT_PAISE = 100;

export function resolveSeatCountForPricing(
  seatOption: string,
  customSeatCount?: number,
): number {
  if (seatOption === "other") {
    const n = Number(customSeatCount);
    return Number.isInteger(n) && n >= 1 ? n : 1;
  }
  const n = Number(seatOption);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export function calculateSheetAmountPaise(seatCount: number): number {
  const paise = Math.round(Math.max(1, seatCount) * COST_PER_SHEET_INR * 100);
  return Math.max(MIN_AMOUNT_PAISE, paise);
}

export function formatInrFromPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatSheetOrderAmount(seatOption: string, customSeatCount?: number): string {
  const seats = resolveSeatCountForPricing(seatOption, customSeatCount);
  return formatInrFromPaise(calculateSheetAmountPaise(seats));
}
