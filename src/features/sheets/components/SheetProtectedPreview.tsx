import type { ReactNode } from "react";
import { blockSheetDragStart } from "../hooks/useSheetPageProtection";
import { SheetContentWatermark } from "./SheetContentWatermark";

type Props = {
  children: ReactNode;
  watermarkLabel: string;
  vendorName?: string;
  className?: string;
};

export function SheetProtectedPreview({ children, watermarkLabel, vendorName, className = "" }: Props) {
  return (
    <div
      className={`sheet-protected-area relative ${className}`}
      onDragStart={blockSheetDragStart}
    >
      {children}
      <SheetContentWatermark label={watermarkLabel} vendorName={vendorName} />
    </div>
  );
}
