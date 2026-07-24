import { Download, Grid, Ruler } from "lucide-react";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { cn } from "@/lib/utils";
import type { CropArea } from "../_model/crop-area";
import { showGridAtom, showRulerAtom } from "../_model/editor-settings";
import { saveCroppedImage } from "./save-cropped-image";
import { ImageEditorZoomControls } from "./image-editor-zoom-controls";

interface ImageEditorHeaderRightProps {
  image: HTMLImageElement;
  appliedCrop: CropArea;
  stageSize: { height: number; width: number } | null;
}

export function ImageEditorHeaderRight({
  image,
  appliedCrop,
  stageSize,
}: ImageEditorHeaderRightProps) {
  const { t } = useAppTranslate();
  const [showRuler, setShowRuler] = useAtom(showRulerAtom);
  const [showGrid, setShowGrid] = useAtom(showGridAtom);

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
      <ImageEditorZoomControls stageSize={stageSize} />
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
