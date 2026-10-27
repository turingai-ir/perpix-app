import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { useImageEditorWorkspace } from "../_hooks/use-image-editor-workspace";
import {
  DEFAULT_EDITOR_EDITS,
  renderEditedImage,
} from "../_model/editor-edits";
import { ImageEditorCanvas } from "./image-editor-canvas";
import { ImageEditorMetadata } from "./image-editor-metadata";
import { EditorPageLoadError, EditorPageLoading } from "./editor-page-state";
import { EditorStudioHeader } from "./editor-studio-header";
import {
  EditorStudioInspector,
  type EditorTool,
} from "./editor-studio-inspector";
import { EditorStudioToolRail } from "./editor-studio-tool-rail";
import { EditorBeforeAfter } from "./editor-before-after";
import { useLoadedImage } from "../_hooks/use-loaded-image";
import "./editor-studio.css";

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
    <ImageEditorWorkspace
      key={src}
      documentId={documentId}
      image={image}
      onBack={onBack}
    />
  );
}

function ImageEditorWorkspace({
  documentId,
  image,
  onBack,
}: {
  documentId?: string;
  image: HTMLImageElement;
  onBack: () => void;
}) {
  const { t } = useAppTranslate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<EditorTool>("crop");
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(90);
  const [outputWidth, setOutputWidth] = useState<number | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const editor = useImageEditorWorkspace(image, containerRef, documentId);
  const quarterTurn =
    editor.edits.rotation === 90 || editor.edits.rotation === 270;
  const naturalWidth = quarterTurn
    ? editor.appliedCrop.height
    : editor.appliedCrop.width;
  const naturalHeight = quarterTurn
    ? editor.appliedCrop.width
    : editor.appliedCrop.height;
  const maxOutputWidth = Math.max(
    1,
    Math.min(8192, Math.floor((8192 * naturalWidth) / naturalHeight)),
  );
  const effectiveOutputWidth =
    outputWidth === null ? null : Math.min(outputWidth, maxOutputWidth);
  const preview = useMemo(
    () => renderEditedImage(image, editor.appliedCrop, editor.edits, 1600),
    [image, editor.appliedCrop, editor.edits],
  );
  const previewImage = editor.isCropping ? image : preview;
  const previewCrop = editor.isCropping
    ? editor.appliedCrop
    : { x: 0, y: 0, width: preview.width, height: preview.height };
  const compareBefore = useMemo(() => {
    if (!showCompare || editor.isCropping) return null;
    return renderEditedImage(
      image,
      editor.appliedCrop,
      {
        ...DEFAULT_EDITOR_EDITS,
        rotation: editor.edits.rotation,
        flipX: editor.edits.flipX,
        flipY: editor.edits.flipY,
      },
      1600,
    );
  }, [
    showCompare,
    editor.isCropping,
    image,
    editor.appliedCrop,
    editor.edits.rotation,
    editor.edits.flipX,
    editor.edits.flipY,
  ]);

  const download = () => {
    try {
      const canvas = renderEditedImage(
        image,
        editor.appliedCrop,
        editor.edits,
        Infinity,
        effectiveOutputWidth ?? undefined,
      );
      const mime = format === "png" ? "image/png" : `image/${format}`;
      const link = document.createElement("a");
      link.href = canvas.toDataURL(mime, quality / 100);
      link.download = `cropped-image.${format === "jpeg" ? "jpg" : format}`;
      link.click();
      toast.success(t("pages.editor.downloadSuccess"));
    } catch {
      toast.error(t("pages.editor.downloadError"));
    }
  };

  return (
    <div
      role="application"
      aria-label={t("pages.editor.studio.application")}
      className="editor-studio"
      dir="rtl"
    >
      <EditorStudioHeader
        onBack={onBack}
        onDownload={download}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        onUndo={editor.undo}
        onRedo={editor.redo}
        stageSize={editor.stageSize}
        showCompare={showCompare}
        onToggleCompare={() => setShowCompare((current) => !current)}
        compareDisabled={editor.isCropping}
      />
      <div className="editor-studio-main">
        <EditorStudioToolRail tool={tool} onSelect={setTool} />
        <div
          ref={containerRef}
          className="editor-studio-stage"
          aria-label={t("pages.editor.studio.workspace")}
        >
          {editor.imageSize && editor.stageSize ? (
            <ImageEditorCanvas
              alignmentGuides={editor.alignmentGuides}
              appliedCrop={previewCrop}
              cardPosition={editor.cardPosition}
              displayedCrop={editor.displayedCrop}
              fixedRatio={editor.fixedCropRatio}
              image={previewImage}
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
          {showCompare && compareBefore && !editor.isCropping ? (
            <EditorBeforeAfter before={compareBefore} after={preview} />
          ) : null}
          <div className="editor-studio-stage-caption" aria-hidden="true">
            PERPIX <span>•</span> STUDIO
          </div>
        </div>
        <EditorStudioInspector
          tool={tool}
          editor={editor}
          format={format}
          setFormat={setFormat}
          quality={quality}
          setQuality={setQuality}
          onDownload={download}
          outputWidth={effectiveOutputWidth}
          setOutputWidth={setOutputWidth}
        />
      </div>
      <div className="editor-studio-status" aria-live="polite">
        <span className="editor-studio-status-dot" />
        {t("pages.editor.studio.ready")}
        <span className="editor-studio-status-size" dir="ltr">
          {effectiveOutputWidth ?? Math.round(naturalWidth)} ×{" "}
          {Math.round(
            ((effectiveOutputWidth ?? naturalWidth) * naturalHeight) /
              naturalWidth,
          )}{" "}
          px
        </span>
      </div>
    </div>
  );
}
