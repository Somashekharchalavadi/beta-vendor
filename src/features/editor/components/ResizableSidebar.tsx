import { useCallback, useRef, type ReactNode } from "react";

type ResizableSidebarProps = {
  width: number;
  minWidth: number;
  maxWidth: number;
  onWidthChange: (width: number) => void;
  side: "left" | "right";
  children: ReactNode;
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ResizableSidebar({
  width,
  minWidth,
  maxWidth,
  onWidthChange,
  side,
  children,
  className = "",
}: ResizableSidebarProps) {
  const dragging = useRef(false);

  const onResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      const startX = e.clientX;
      const startWidth = width;

      const onMove = (ev: PointerEvent) => {
        if (!dragging.current) return;
        const delta = side === "left" ? ev.clientX - startX : startX - ev.clientX;
        onWidthChange(clamp(startWidth + delta, minWidth, maxWidth));
      };

      const onUp = () => {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [width, minWidth, maxWidth, onWidthChange, side],
  );

  return (
    <aside
      className={`relative flex shrink-0 flex-col overflow-hidden ${className}`}
      style={{ width }}
    >
      {children}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={width}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        title="Drag to resize"
        onPointerDown={onResizeStart}
        className={`absolute top-0 z-20 h-full w-1.5 touch-none transition-colors hover:bg-[#006837]/25 ${
          side === "left" ? "right-0 cursor-col-resize" : "left-0 cursor-col-resize"
        }`}
      />
    </aside>
  );
}
