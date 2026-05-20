import type { EditorAction, EditorDocument, EditorState } from "../types";
import { duplicateElement, resetZCounter } from "../utils/elementFactory";
import { sanitizeTemplateDocument } from "../utils/fieldData";
import { createDefaultA4Document } from "../utils/templates";

function cloneDoc(doc: EditorDocument): EditorDocument {
  return JSON.parse(JSON.stringify(doc)) as EditorDocument;
}

function pushHistory(state: EditorState, doc: EditorDocument): EditorState {
  const trimmed = state.history.slice(0, state.historyIndex + 1);
  trimmed.push(cloneDoc(doc));
  return {
    ...state,
    doc,
    history: trimmed.slice(-50),
    historyIndex: Math.min(trimmed.length - 1, 49),
    isSaved: false,
  };
}

function getActivePage(state: EditorState) {
  return state.doc.pages[state.activePageIndex];
}

function updateDoc(state: EditorState, updater: (doc: EditorDocument) => EditorDocument): EditorState {
  const doc = updater(cloneDoc(state.doc));
  const maxZ = Math.max(0, ...doc.pages.flatMap((p) => p.elements.map((e) => e.zIndex)));
  resetZCounter(maxZ);
  return pushHistory(state, doc);
}

export function createInitialState(): EditorState {
  const doc = createDefaultA4Document();
  return {
    doc,
    activePageIndex: 0,
    selectedId: null,
    zoom: 1,
    panelMode: "elements",
    elementsTab: "fields",
    propertiesTab: "design",
    fieldSearch: "",
    showGrid: true,
    snapToGrid: true,
    isPreviewOpen: false,
    isSaved: true,
    history: [cloneDoc(doc)],
    historyIndex: 0,
  };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_DOC":
      resetZCounter(Math.max(0, ...action.doc.pages.flatMap((p) => p.elements.map((e) => e.zIndex))));
      return { ...state, doc: cloneDoc(action.doc), isSaved: false };

    case "SET_TITLE":
      return updateDoc(state, (doc) => ({ ...doc, title: action.title }));

    case "SELECT":
      return { ...state, selectedId: action.id };

    case "SET_ZOOM":
      return { ...state, zoom: Math.min(3, Math.max(0.25, action.zoom)) };

    case "SET_PANEL":
      return { ...state, panelMode: action.panel };

    case "SET_ELEMENTS_TAB":
      return { ...state, elementsTab: action.tab };

    case "SET_PROPERTIES_TAB":
      return { ...state, propertiesTab: action.tab };

    case "SET_FIELD_SEARCH":
      return { ...state, fieldSearch: action.search };

    case "TOGGLE_GRID":
      return { ...state, showGrid: !state.showGrid };

    case "TOGGLE_SNAP":
      return { ...state, snapToGrid: !state.snapToGrid };

    case "SET_PREVIEW":
      return { ...state, isPreviewOpen: action.open };

    case "SET_SAVED":
      return { ...state, isSaved: action.saved };

    case "SET_CANVAS_SIZE":
      return updateDoc(state, (doc) => ({
        ...doc,
        canvasWidthMm: action.widthMm,
        canvasHeightMm: action.heightMm,
      }));

    case "SET_BACKGROUND":
      return updateDoc(state, (doc) => ({
        ...doc,
        background: { ...doc.background, ...action.background },
      }));

    case "ADD_ELEMENT": {
      const pageIndex = action.pageIndex ?? state.activePageIndex;
      return updateDoc(state, (doc) => {
        const pages = [...doc.pages];
        const page = { ...pages[pageIndex], elements: [...pages[pageIndex].elements, action.element] };
        pages[pageIndex] = page;
        return { ...doc, pages };
      });
    }

    case "UPDATE_ELEMENT": {
      const doc = cloneDoc(state.doc);
      const patch = { ...action.patch };
      const target = doc.pages.flatMap((p) => p.elements).find((e) => e.id === action.id);
      if ((target?.type === "field" || target?.type === "text") && "content" in patch) {
        delete patch.content;
      }
      if (target?.type === "qr" && "qrValue" in patch) {
        delete patch.qrValue;
      }
      doc.pages = doc.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === action.id ? { ...el, ...patch } : el,
        ),
      }));
      return { ...state, doc, isSaved: false };
    }

    case "DELETE_ELEMENT":
      return {
        ...updateDoc(state, (doc) => ({
          ...doc,
          pages: doc.pages.map((page) => ({
            ...page,
            elements: page.elements.filter((el) => el.id !== action.id),
          })),
        })),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };

    case "DUPLICATE_ELEMENT": {
      const page = getActivePage(state);
      const el = page.elements.find((e) => e.id === action.id);
      if (!el) return state;
      const copy = duplicateElement(el);
      return {
        ...updateDoc(state, (doc) => {
          const pages = [...doc.pages];
          pages[state.activePageIndex] = {
            ...pages[state.activePageIndex],
            elements: [...pages[state.activePageIndex].elements, copy],
          };
          return { ...doc, pages };
        }),
        selectedId: copy.id,
      };
    }

    case "REORDER_ELEMENT": {
      const page = getActivePage(state);
      const sorted = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex((e) => e.id === action.id);
      if (idx < 0) return state;
      let swapIdx = idx;
      if (action.direction === "up" && idx < sorted.length - 1) swapIdx = idx + 1;
      else if (action.direction === "down" && idx > 0) swapIdx = idx - 1;
      else if (action.direction === "top") swapIdx = sorted.length - 1;
      else if (action.direction === "bottom") swapIdx = 0;
      else return state;
      if (swapIdx === idx) return state;
      const zA = sorted[idx].zIndex;
      const zB = sorted[swapIdx].zIndex;
      return updateDoc(state, (doc) => ({
        ...doc,
        pages: doc.pages.map((p, pi) =>
          pi !== state.activePageIndex
            ? p
            : {
                ...p,
                elements: p.elements.map((e) => {
                  if (e.id === sorted[idx].id) return { ...e, zIndex: zB };
                  if (e.id === sorted[swapIdx].id) return { ...e, zIndex: zA };
                  return e;
                }),
              },
        ),
      }));
    }

    case "SET_PAGE":
      return { ...state, activePageIndex: action.index, selectedId: null };

    case "ADD_PAGE":
      return updateDoc(state, (doc) => ({
        ...doc,
        pages: [
          ...doc.pages,
          { id: `page-${crypto.randomUUID().slice(0, 8)}`, name: `Page ${doc.pages.length + 1}`, elements: [] },
        ],
      }));

    case "DELETE_PAGE": {
      if (state.doc.pages.length <= 1) return state;
      const index = action.index;
      return {
        ...updateDoc(state, (doc) => ({
          ...doc,
          pages: doc.pages.filter((_, i) => i !== index),
        })),
        activePageIndex: Math.min(state.activePageIndex, state.doc.pages.length - 2),
        selectedId: null,
      };
    }

    case "LOAD_TEMPLATE":
      resetZCounter(Math.max(0, ...action.doc.pages.flatMap((p) => p.elements.map((e) => e.zIndex))));
      return {
        ...state,
        doc: sanitizeTemplateDocument(cloneDoc(action.doc)),
        activePageIndex: 0,
        selectedId: null,
        isSaved: false,
        history: [cloneDoc(action.doc)],
        historyIndex: 0,
      };

    case "ADD_UPLOAD":
      return {
        ...state,
        doc: { ...state.doc, uploads: [...state.doc.uploads, action.src] },
      };

    case "UNDO": {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      const doc = cloneDoc(state.history[newIndex]);
      resetZCounter(Math.max(0, ...doc.pages.flatMap((p) => p.elements.map((e) => e.zIndex))));
      return { ...state, doc, historyIndex: newIndex, selectedId: null };
    }

    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      const doc = cloneDoc(state.history[newIndex]);
      resetZCounter(Math.max(0, ...doc.pages.flatMap((p) => p.elements.map((e) => e.zIndex))));
      return { ...state, doc, historyIndex: newIndex, selectedId: null };
    }

    case "COMMIT_HISTORY": {
      const current = JSON.stringify(state.doc);
      const last = JSON.stringify(state.history[state.historyIndex]);
      if (current === last) return state;
      return pushHistory(state, state.doc);
    }

    default:
      return state;
  }
}
