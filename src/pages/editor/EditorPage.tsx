import { EditorProvider } from "../../features/editor/context/EditorContext";
import { EditorWorkspace } from "../../features/editor/components/EditorWorkspace";

export function EditorPage() {
  return (
    <EditorProvider>
      <EditorWorkspace />
    </EditorProvider>
  );
}
