import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export function TopLoadingBar() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const active = fetching > 0 || mutating > 0;
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (active) {
      setVisible(true);
      setProgress(12);
      const t1 = window.setTimeout(() => setProgress(45), 120);
      const t2 = window.setTimeout(() => setProgress(72), 400);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    setProgress(100);
    const hide = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 280);
    return () => window.clearTimeout(hide);
  }, [active]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-0.5 bg-transparent"
      role="progressbar"
      aria-hidden={!visible}
    >
      <div
        className={cn(
          "h-full bg-brand-600 shadow-sm transition-all duration-300 ease-out",
          !active && progress === 100 && "opacity-0",
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
