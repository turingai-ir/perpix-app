import { ImageEditorCanvas } from "./image-editor-canvas";
import { ImageEditorHeader } from "./image-editor-header";
import { ImageEditorMetadata } from "./image-editor-metadata";
import { ImageEditorToolbar } from "./image-editor-toolbar";
import { useImageEditorWorkspace } from "../_hooks/use-image-editor-workspace";
import { useLoadedImage } from "../_hooks/use-loaded-image";
import { EditorPageLoadError, EditorPageLoading } from "./editor-page-state";

interface ImageEditorProps {
  documentId?: string;
  onBack: () => void;
  src: string;
}

export function ImageEditor({ documentId, onBack, src }: ImageEditorProps) {
  const { image, isError } = useLoadedImage(src);
  if (isError) return <EditorPageLoadError onBack={onBack} />;
  if (!image) return <EditorPageLoading />;
  return (
    <ImageEditorWorkspace key={src} documentId={documentId} image={image} />
  );
}

interface ImageEditorWorkspaceProps {
  documentId?: string;
  image: HTMLImageElement;
}

function ImageEditorWorkspace({
  documentId,
  image,
}: ImageEditorWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useImageEditorWorkspace(image, containerRef, documentId);
  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="ویرایش تصویر"
      className="relative h-full w-full overflow-hidden bg-neutral-950"
    >
      <ImageEditorHeader
        image={image}
        appliedCrop={editor.appliedCrop}
        canRedo={editor.canRedo}
        canUndo={editor.canUndo}
        isCropping={editor.isCropping}
        onRedo={editor.redo}
        onUndo={editor.undo}
        stageSize={editor.stageSize}
      />
      {editor.imageSize && editor.stageSize ? (
        <ImageEditorCanvas
          alignmentGuides={editor.alignmentGuides}
          appliedCrop={editor.appliedCrop}
          cardPosition={editor.cardPosition}
          displayedCrop={editor.displayedCrop}
          fixedRatio={editor.fixedCropRatio}
          image={image}
          imagePosition={editor.imagePosition}
          imageSize={editor.imageSize}
          isCropping={editor.isCropping}
          isImageSelected={editor.isImageSelected}
          onClearAlignmentGuides={editor.clearAlignmentGuides}
          onCropChange={editor.changeCrop}
          onDeselectImage={editor.deselectImage}
          onImageDragEnd={editor.finishImageDrag}
          onImageDragMove={editor.moveImage}
          onSelectImage={editor.selectImage}
          stageSize={editor.stageSize}
        />
      ) : null}
      {editor.imageSize ? (
        <ImageEditorMetadata
          crop={editor.draftCrop}
          imagePosition={editor.imagePosition}
          imageSize={editor.imageSize}
          isCropping={editor.isCropping}
          ratio={editor.selectedCropRatioValue}
        />
      ) : null}
      <ImageEditorToolbar
        isCropping={editor.isCropping}
        isImageSelected={editor.isImageSelected}
        onApplyCrop={editor.applyCrop}
        onBeginCrop={editor.beginCrop}
        onCancelCrop={editor.cancelCrop}
        onSelectRatio={editor.selectCropRatio}
        selectedRatio={editor.selectedCropRatio}
      />
    </div>
  );
}
import { useRef } from "react";
