import { ArrowLeft, Download, Grid, Ruler } from "lucide-react";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { useRouteBack } from "@/hooks/use-route-back";
import { cn } from "@/lib/utils";
import type { CropArea } from "../_model/crop-area";
import { showGridAtom, showRulerAtom } from "../_model/editor-settings";
import { EditorHistoryControls } from "./editor-history-controls";
import { saveCroppedImage } from "./save-cropped-image";

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
  const [showRuler, setShowRuler] = useAtom(showRulerAtom);
  const [showGrid, setShowGrid] = useAtom(showGridAtom);

  if (isCropping) return null;

  const handleSave = () => {
    try {
      const dataUrl = saveCroppedImage(image, appliedCrop);
      const link = document.createElement("a");
      link.download = "cropped-image.png";
      link.href = dataUrl;
      link.click();
      toast.success(t("pages.editor.downloadSuccess"));
    } catch {
      toast.error(t("pages.editor.downloadError"));
    }
  };

  return (
    <div
      role="banner"
      aria-label="منوی بالایی"
      className="absolute inset-x-3 top-3 z-10 mx-auto flex w-[calc(100%-1.5rem)] max-w-lg items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/95 px-4 py-2 text-white shadow-2xl backdrop-blur"
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

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowRuler(!showRuler)}
          className={cn(
            "h-10 w-10 text-white hover:bg-white/10 hover:text-white",
            showRuler && "bg-white/10 text-white",
          )}
          title={t("pages.editor.toggleRuler")}
          aria-label={t("pages.editor.toggleRuler")}
          aria-pressed={showRuler ? "true" : "false"}
        >
          <Ruler className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowGrid(!showGrid)}
          className={cn(
            "h-10 w-10 text-white hover:bg-white/10 hover:text-white",
            showGrid && "bg-white/10 text-white",
          )}
          title={t("pages.editor.toggleGrid")}
          aria-label={t("pages.editor.toggleGrid")}
          aria-pressed={showGrid ? "true" : "false"}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleSave}
          className="h-10 gap-2 bg-white font-medium text-neutral-950 hover:bg-white/90"
        >
          <Download className="h-4 w-4" />
          <span>{t("pages.editor.download")}</span>
        </Button>
      </div>
    </div>
  );
}
