import { useAtom } from "jotai";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { zoomAtom, panAtom } from "../_model/editor-settings";

interface ImageEditorZoomControlsProps {
  stageSize: { height: number; width: number } | null;
}

export function ImageEditorZoomControls({
  stageSize,
}: ImageEditorZoomControlsProps) {
  const { t } = useAppTranslate();
  const [zoom, setZoom] = useAtom(zoomAtom);
  const [pan, setPan] = useAtom(panAtom);

  const handleZoom = (factor: number) => {
    const oldScale = zoom;
    const newScale = Math.max(0.1, Math.min(oldScale * factor, 10));

    const width = stageSize?.width ?? 600;
    const height = stageSize?.height ?? 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const centerPointTo = {
      x: (centerX - pan.x) / oldScale,
      y: (centerY - pan.y) / oldScale,
    };

    setZoom(newScale);
    setPan({
      x: centerX - centerPointTo.x * newScale,
      y: centerY - centerPointTo.y * newScale,
    });
  };

  return (
    <div
      className="flex items-center gap-0.5 border-l border-white/10 pl-1"
      dir="ltr"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleZoom(1 / 1.2)}
        className="h-10 w-10 text-white hover:bg-white/10 hover:text-white"
        title={t("pages.editor.zoomOut")}
        aria-label={t("pages.editor.zoomOut")}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <button
        type="button"
        onClick={() => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }}
        className="flex h-10 min-w-[42px] items-center justify-center rounded px-1.5 font-mono text-xs text-white hover:bg-white/10"
        title={t("pages.editor.resetZoom")}
        aria-label={t("pages.editor.resetZoom")}
      >
        {Math.round(zoom * 100)}%
      </button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleZoom(1.2)}
        className="h-10 w-10 text-white hover:bg-white/10 hover:text-white"
        title={t("pages.editor.zoomIn")}
        aria-label={t("pages.editor.zoomIn")}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
}
