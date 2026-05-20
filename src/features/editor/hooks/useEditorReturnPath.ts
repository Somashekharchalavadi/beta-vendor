import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RETURN_KEY = "documentsheet-editor-return";

/** Remember which portal page opened the editor so Back returns there. */
export function useEditorReturnPath() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/editor") return;

    const path = location.pathname + location.search;
    sessionStorage.setItem(RETURN_KEY, path || "/");
  }, [location.pathname, location.search]);
}

export function getEditorReturnPath(): string | null {
  return sessionStorage.getItem(RETURN_KEY);
}
