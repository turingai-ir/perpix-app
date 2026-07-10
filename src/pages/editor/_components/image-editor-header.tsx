import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { useRouteBack } from "@/hooks/use-route-back";
import type { CropArea } from "../_model/crop-area";
import { EditorHistoryControls } from "./editor-history-controls";

interface ImageEditorHeaderProps {
  image: HTMLImageElement;
  appliedCrop: CropArea;
  canRedo: boolean;
  canUndo: boolean;
  isCropping: boolean;
  onRedo: () => void;
  onUndo: () => void;
}

export function ImageEditorHeader({
  image,
  appliedCrop,
  canRedo,
  canUndo,
  isCropping,
  onRedo,
  onUndo,
}: ImageEditorHeaderProps) {
  const { t } = useAppTranslate();
  const routeBack = useRouteBack();

  if (isCropping) return null;

  const handleSave = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = appliedCrop.width;
      canvas.height = appliedCrop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context");
      ctx.drawImage(
        image,
        appliedCrop.x,
        appliedCrop.y,
        appliedCrop.width,
        appliedCrop.height,
        0,
        0,
        appliedCrop.width,
        appliedCrop.height,
      );
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "cropped-image.png";
      link.href = dataUrl;
      link.click();
      toast.success(t("pages.editor.downloadSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("pages.editor.downloadError"));
    }
  };

  return (
    <div
      role="banner"
      aria-label="منوی بالایی"
      className="absolute inset-x-3 top-3 z-10 mx-auto flex w-[calc(100%-1.5rem)] max-w-md items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/95 px-4 py-2 text-white shadow-2xl backdrop-blur"
    >
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          onClick={routeBack}
          className="h-10 gap-2 text-white hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("pages.editor.back")}</span>
        </Button>
        <EditorHistoryControls {...{ canRedo, canUndo, onRedo, onUndo }} />
      </div>

      <Button
        onClick={handleSave}
        className="h-10 gap-2 bg-white font-medium text-neutral-950 hover:bg-white/90"
      >
        <Download className="h-4 w-4" />
        <span>{t("pages.editor.download")}</span>
      </Button>
    </div>
  );
}
