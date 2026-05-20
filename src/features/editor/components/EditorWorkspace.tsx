import { EditorCanvas } from "./EditorCanvas";
import { EditorLeftPanel } from "./EditorLeftPanel";
import { EditorNavRail } from "./EditorNavRail";
import { EditorPageStrip } from "./EditorPageStrip";
import { EditorPropertiesPanel } from "./EditorPropertiesPanel";
import { EditorToolbar } from "./EditorToolbar";
import { EditorTopBar } from "./EditorTopBar";
import { PreviewModal } from "./PreviewModal";
import { ResizableSidebar } from "./ResizableSidebar";
import { useEditor } from "../context/EditorContext";
import { useSidebarWidths } from "../hooks/useSidebarWidths";
import { EditorLoadingOverlay } from "./EditorLoadingOverlay";

export function EditorWorkspace() {
  const { isLoading, loadError } = useEditor();
  const {
    leftWidth,
    rightWidth,
    setLeftWidth,
    setRightWidth,
    leftMin,
    leftMax,
    rightMin,
    rightMax,
  } = useSidebarWidths();

  if (loadError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-100 p-6">
        <p className="text-sm font-medium text-red-600">{loadError}</p>
        <p className="mt-2 text-xs text-slate-500">Check that you are signed in and the API is running.</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-slate-100">
      {isLoading && <EditorLoadingOverlay />}
      <EditorTopBar />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <EditorNavRail />
        <ResizableSidebar
          side="left"
          width={leftWidth}
          minWidth={leftMin}
          maxWidth={leftMax}
          onWidthChange={setLeftWidth}
          className="border-r border-slate-200 bg-white"
        >
          <EditorLeftPanel />
        </ResizableSidebar>
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#e8ecf0]">
          <EditorToolbar />
          <EditorCanvas />
          <EditorPageStrip />
        </main>
        <ResizableSidebar
          side="right"
          width={rightWidth}
          minWidth={rightMin}
          maxWidth={rightMax}
          onWidthChange={setRightWidth}
          className="border-l border-slate-200 bg-white"
        >
          <EditorPropertiesPanel />
        </ResizableSidebar>
      </div>
      <PreviewModal />
    </div>
  );
}
