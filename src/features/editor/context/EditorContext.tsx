import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import { STORAGE_KEY } from "../constants";
import type { CanvasElement, EditorAction, EditorState } from "../types";
import {
  useCreateTemplateMutation,
  useSaveTemplateMutation,
  useTemplateQuery,
} from "../hooks/useEditorQueries";
import { sanitizeTemplateDocument } from "../utils/fieldData";
import { createInitialState, editorReducer } from "./editorReducer";

type EditorContextValue = {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  activePage: EditorState["doc"]["pages"][number];
  selectedElement: CanvasElement | null;
  canUndo: boolean;
  canRedo: boolean;
  templateId: string | null;
  isLoading: boolean;
  loadError: string | null;
  isSaving: boolean;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, patch: Partial<CanvasElement>) => void;
  selectElement: (id: string | null) => void;
  saveToServer: () => Promise<string | null>;
  saveToLocal: () => void;
  loadFromLocal: () => boolean;
};

const EditorContext = createContext<EditorContextValue | null>(null);

type EditorProviderProps = {
  children: ReactNode;
  templateId?: string | null;
};

export function EditorProvider({ children, templateId: templateIdProp }: EditorProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const templateIdFromUrl = searchParams.get("templateId");
  const templateId = templateIdProp ?? templateIdFromUrl ?? null;

  const [state, dispatch] = useReducer(editorReducer, undefined, createInitialState);
  const skipLoadRef = useRef(false);
  const loadedDocIdRef = useRef<string | null>(null);

  const templateQuery = useTemplateQuery(templateId);
  const saveMutation = useSaveTemplateMutation();
  const createMutation = useCreateTemplateMutation();

  const isLoading = Boolean(templateId) && templateQuery.isLoading;
  const loadError =
    templateQuery.isError && templateQuery.error
      ? templateQuery.error instanceof Error
        ? templateQuery.error.message
        : "Failed to load template"
      : null;
  const isSaving = saveMutation.isPending || createMutation.isPending;

  useEffect(() => {
    loadedDocIdRef.current = null;
  }, [templateId]);

  useEffect(() => {
    if (skipLoadRef.current) {
      skipLoadRef.current = false;
      return;
    }

    if (templateId && templateQuery.data?.document) {
      if (loadedDocIdRef.current === templateId) return;
      loadedDocIdRef.current = templateId;
      dispatch({ type: "LOAD_TEMPLATE", doc: templateQuery.data.document });
      dispatch({ type: "SET_SAVED", saved: true });
      return;
    }

    if (!templateId && loadedDocIdRef.current !== "local") {
      loadedDocIdRef.current = "local";
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const doc = sanitizeTemplateDocument(JSON.parse(raw) as EditorState["doc"]);
          dispatch({ type: "LOAD_TEMPLATE", doc });
          dispatch({ type: "SET_SAVED", saved: true });
        } catch {
          /* use default */
        }
      }
    }
  }, [templateId, templateQuery.data]);

  const activePage = state.doc.pages[state.activePageIndex];
  const selectedElement =
    state.selectedId != null
      ? activePage.elements.find((e) => e.id === state.selectedId) ?? null
      : null;

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const addElement = useCallback((element: CanvasElement) => {
    dispatch({ type: "ADD_ELEMENT", element });
    dispatch({ type: "SELECT", id: element.id });
  }, []);

  const updateElement = useCallback((id: string, patch: Partial<CanvasElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id, patch });
  }, []);

  const selectElement = useCallback((id: string | null) => {
    dispatch({ type: "SELECT", id });
  }, []);

  const saveToLocal = useCallback(() => {
    const template = sanitizeTemplateDocument(state.doc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
    dispatch({ type: "SET_SAVED", saved: true });
  }, [state.doc]);

  const saveToServer = useCallback(async (): Promise<string | null> => {
    const payload = sanitizeTemplateDocument(state.doc);

    if (templateId) {
      await saveMutation.mutateAsync({ id: templateId, document: payload });
      dispatch({ type: "SET_SAVED", saved: true });
      loadedDocIdRef.current = templateId;
      return templateId;
    }

    const result = await createMutation.mutateAsync(payload);
    dispatch({ type: "SET_SAVED", saved: true });
    skipLoadRef.current = true;
    loadedDocIdRef.current = result.template.id;
    setSearchParams({ templateId: result.template.id }, { replace: true });
    return result.template.id;
  }, [state.doc, templateId, saveMutation, createMutation, setSearchParams]);

  const loadFromLocal = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const doc = sanitizeTemplateDocument(JSON.parse(raw) as EditorState["doc"]);
      dispatch({ type: "LOAD_TEMPLATE", doc });
      loadedDocIdRef.current = "local";
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) dispatch({ type: "REDO" });
        else dispatch({ type: "UNDO" });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        void saveToServer();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
        if (state.selectedId) {
          e.preventDefault();
          dispatch({ type: "DELETE_ELEMENT", id: state.selectedId });
        }
      }
      if (e.key === "d" && (e.metaKey || e.ctrlKey) && state.selectedId) {
        e.preventDefault();
        dispatch({ type: "DUPLICATE_ELEMENT", id: state.selectedId });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.selectedId, saveToServer]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      activePage,
      selectedElement,
      canUndo,
      canRedo,
      templateId,
      isLoading,
      loadError,
      isSaving,
      addElement,
      updateElement,
      selectElement,
      saveToServer,
      saveToLocal,
      loadFromLocal,
    }),
    [
      state,
      activePage,
      selectedElement,
      canUndo,
      canRedo,
      templateId,
      isLoading,
      loadError,
      isSaving,
      addElement,
      updateElement,
      selectElement,
      saveToServer,
      saveToLocal,
      loadFromLocal,
    ],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}

export function useEditorDispatch() {
  return useEditor().dispatch;
}
