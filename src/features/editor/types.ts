export type ElementType = "text" | "image" | "shape" | "qr" | "field";

export type TextAlign = "left" | "center" | "right";
export type PanelMode = "templates" | "elements" | "text" | "images" | "qr" | "shapes" | "uploads" | "layers";
export type ElementsTab = "basic" | "fields" | "smart";
export type PropertiesTab = "design" | "settings";
export type ShapeKind = "rect" | "circle" | "line";

export type CanvasElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked?: boolean;
  content?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: TextAlign;
  lineHeight?: number;
  letterSpacing?: number;
  borderRadius?: number;
  src?: string;
  shape?: ShapeKind;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  qrValue?: string;
  fieldKey?: string;
  label?: string;
};

export type CanvasPage = {
  id: string;
  name: string;
  elements: CanvasElement[];
};

export type CanvasBackground = {
  color: string;
  opacity: number;
};

export type EditorDocument = {
  title: string;
  canvasWidthMm: number;
  canvasHeightMm: number;
  background: CanvasBackground;
  pages: CanvasPage[];
  uploads: string[];
};

export type EditorState = {
  doc: EditorDocument;
  activePageIndex: number;
  selectedId: string | null;
  zoom: number;
  panelMode: PanelMode;
  elementsTab: ElementsTab;
  propertiesTab: PropertiesTab;
  fieldSearch: string;
  showGrid: boolean;
  snapToGrid: boolean;
  isPreviewOpen: boolean;
  isSaved: boolean;
  history: EditorDocument[];
  historyIndex: number;
};

export type EditorAction =
  | { type: "SET_DOC"; doc: EditorDocument }
  | { type: "SET_TITLE"; title: string }
  | { type: "SELECT"; id: string | null }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_PANEL"; panel: PanelMode }
  | { type: "SET_ELEMENTS_TAB"; tab: ElementsTab }
  | { type: "SET_PROPERTIES_TAB"; tab: PropertiesTab }
  | { type: "SET_FIELD_SEARCH"; search: string }
  | { type: "TOGGLE_GRID" }
  | { type: "TOGGLE_SNAP" }
  | { type: "SET_PREVIEW"; open: boolean }
  | { type: "SET_SAVED"; saved: boolean }
  | { type: "SET_CANVAS_SIZE"; widthMm: number; heightMm: number }
  | { type: "SET_BACKGROUND"; background: Partial<CanvasBackground> }
  | { type: "ADD_ELEMENT"; element: CanvasElement; pageIndex?: number }
  | { type: "UPDATE_ELEMENT"; id: string; patch: Partial<CanvasElement> }
  | { type: "DELETE_ELEMENT"; id: string }
  | { type: "DUPLICATE_ELEMENT"; id: string }
  | { type: "REORDER_ELEMENT"; id: string; direction: "up" | "down" | "top" | "bottom" }
  | { type: "SET_PAGE"; index: number }
  | { type: "ADD_PAGE" }
  | { type: "DELETE_PAGE"; index: number }
  | { type: "LOAD_TEMPLATE"; doc: EditorDocument }
  | { type: "ADD_UPLOAD"; src: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "COMMIT_HISTORY" };
