import type { CropArea } from "../_model/crop-area";
import { ImageEditorHeaderLeft } from "./image-editor-header-left";
import { ImageEditorHeaderRight } from "./image-editor-header-right";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageEditorHeaderProps {
  image: HTMLImageElement;
  appliedCrop: CropArea;
  canRedo: boolean;
  canUndo: boolean;
  isCropping: boolean;
  onRedo: () => void;
  onUndo: () => void;
  stageSize: { height: number; width: number } | null;
}

export function ImageEditorHeader({
  image,
  appliedCrop,
  canRedo,
  canUndo,
  isCropping,
  onRedo,
  onUndo,
  stageSize,
}: ImageEditorHeaderProps) {
  if (isCropping) return null;

  return (
    <div
      role="banner"
      aria-label="منوی بالایی"
      className="absolute inset-x-3 top-3 z-10 mx-auto flex w-[calc(100%-1.5rem)] max-w-xl items-center rounded-2xl border border-white/10 bg-neutral-900/95 text-white shadow-2xl backdrop-blur h-[52px] overflow-hidden"
    >
      <ScrollArea
        className="w-full h-full"
        viewportClassName="overflow-x-auto overflow-y-hidden [&>div]:!flex [&>div]:!w-auto [&>div]:!min-w-max [&>div]:items-center [&>div]:h-full"
        orientation="horizontal"
      >
        <div className="flex w-full min-w-max items-center justify-between gap-4 px-3 py-1.5 h-full">
          <ImageEditorHeaderLeft {...{ canRedo, canUndo, onRedo, onUndo }} />
          <ImageEditorHeaderRight {...{ image, appliedCrop, stageSize }} />
        </div>
      </ScrollArea>
    </div>
  );
}
