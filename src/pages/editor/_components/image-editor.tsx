import { EditorProvider } from "./editor-context";
import { EditorWorkspace } from "./editor-workspace";
import { EditorCanvas } from "./editor-canvas";
import { CropPanel } from "./crop-panel";
import { ResizePanel } from "./resize-panel";
import { FiltersPanel } from "./filters-panel";
import { EditorToolbar } from "./editor-toolbar";
import { EditorHeader } from "./editor-header";

export interface ImageEditorProps {
  src: string;
  onSave?: (dataUrl: string) => void;
  onSaveToGallery?: (dataUrl: string) => Promise<void>;
}

export function ImageEditor({
  src,
  onSave,
  onSaveToGallery,
}: ImageEditorProps) {
  return (
    <EditorProvider src={src}>
      <EditorWorkspace onSave={onSave} onSaveToGallery={onSaveToGallery} />
    </EditorProvider>
  );
}

// Compound component properties
ImageEditor.Provider = EditorProvider;
ImageEditor.Workspace = EditorWorkspace;
ImageEditor.Canvas = EditorCanvas;
ImageEditor.Crop = CropPanel;
ImageEditor.Resize = ResizePanel;
ImageEditor.Filters = FiltersPanel;
ImageEditor.Toolbar = EditorToolbar;
ImageEditor.Header = EditorHeader;
