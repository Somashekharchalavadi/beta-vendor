import { QRCodeSVG } from "qrcode.react";
import type { CanvasElement } from "../types";
import {
  getFieldPlaceholder,
  getFieldPreviewValue,
  getQrPreviewValue,
  getTextPlaceholder,
  getTextPreviewValue,
} from "../utils/fieldData";

type Props = {
  element: CanvasElement;
  isSelected: boolean;
  isPreview?: boolean;
  fieldData?: Record<string, string> | null;
  onSelect: () => void;
  onPointerDown: (e: React.PointerEvent, mode: "move" | "resize", handle?: string) => void;
};

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;

export function CanvasElementView({
  element,
  isSelected,
  isPreview,
  fieldData,
  onSelect,
  onPointerDown,
}: Props) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    zIndex: element.zIndex,
    cursor: isPreview ? "default" : "move",
    outline: isSelected && !isPreview ? "2px dashed #006837" : undefined,
    outlineOffset: 2,
  };

  const content = renderContent(element, isPreview, fieldData);

  return (
    <div
      style={style}
      onPointerDown={(e) => {
        if (isPreview) return;
        e.stopPropagation();
        onSelect();
        onPointerDown(e, "move");
      }}
      className={element.locked ? "pointer-events-none" : ""}
    >
      {content}
      {isSelected && !isPreview && (
        <>
          {HANDLES.map((h) => (
            <span
              key={h}
              className="absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#006837] shadow"
              style={handlePosition(h, element.width, element.height)}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelect();
                onPointerDown(e, "resize", h);
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

function handlePosition(h: string, w: number, height: number): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    nw: { left: 0, top: 0 },
    n: { left: w / 2, top: 0 },
    ne: { left: w, top: 0 },
    e: { left: w, top: height / 2 },
    se: { left: w, top: height },
    s: { left: w / 2, top: height },
    sw: { left: 0, top: height },
    w: { left: 0, top: height / 2 },
  };
  return map[h] ?? {};
}

function renderContent(
  el: CanvasElement,
  isPreview?: boolean,
  fieldData?: Record<string, string> | null,
) {
  const textStyle: React.CSSProperties = {
    fontFamily: el.fontFamily,
    fontSize: el.fontSize,
    fontWeight: el.fontWeight as React.CSSProperties["fontWeight"],
    color: el.color,
    textAlign: el.textAlign,
    lineHeight: el.lineHeight,
    letterSpacing: el.letterSpacing,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent:
      el.textAlign === "center" ? "center" : el.textAlign === "right" ? "flex-end" : "flex-start",
    overflow: "hidden",
    wordBreak: "break-word",
    borderRadius: el.borderRadius,
  };

  switch (el.type) {
    case "text":
      if (!isPreview) {
        return (
          <div
            style={{
              ...textStyle,
              color: "#64748b",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            {getTextPlaceholder()}
          </div>
        );
      }
      return <div style={textStyle}>{getTextPreviewValue(el.content, fieldData)}</div>;
    case "field": {
      if (!isPreview) {
        return (
          <div
            style={{
              ...textStyle,
              color: "#64748b",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            {getFieldPlaceholder(el.fieldKey ?? "", el.label)}
          </div>
        );
      }
      return (
        <div style={{ ...textStyle, color: el.color ?? "#111827", fontStyle: "normal" }}>
          {getFieldPreviewValue(el.fieldKey ?? "", fieldData)}
        </div>
      );
    }
    case "image":
      return el.src ? (
        <img src={el.src} alt="" className="h-full w-full object-cover" style={{ borderRadius: el.borderRadius }} draggable={false} />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-slate-200 text-xs text-slate-500"
          style={{ borderRadius: el.borderRadius }}
        >
          Image
        </div>
      );
    case "shape":
      if (el.shape === "circle") {
        return (
          <div
            className="h-full w-full rounded-full"
            style={{ background: el.fill, border: el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : undefined }}
          />
        );
      }
      if (el.shape === "line") {
        return <div className="h-full w-full" style={{ background: el.fill ?? el.stroke, height: Math.max(2, el.strokeWidth ?? 2) }} />;
      }
      return (
        <div
          className="h-full w-full"
          style={{
            background: el.fill,
            borderRadius: el.borderRadius,
            border: el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : undefined,
          }}
        />
      );
    case "qr":
      if (!isPreview) {
        return (
          <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-xs font-medium italic text-slate-500">
            {"{{QR Code}}"}
          </div>
        );
      }
      return (
        <div className="flex h-full w-full items-center justify-center bg-white p-1">
          <QRCodeSVG value={getQrPreviewValue(fieldData)} size={Math.min(el.width, el.height) - 4} />
        </div>
      );
    default:
      return null;
  }
}
