import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { useRouteBack } from "@/hooks/use-route-back";
import { EditorHistoryControls } from "./editor-history-controls";

interface ImageEditorHeaderLeftProps {
  canRedo: boolean;
  canUndo: boolean;
  onRedo: () => void;
  onUndo: () => void;
}

export function ImageEditorHeaderLeft({
  canRedo,
  canUndo,
  onRedo,
  onUndo,
}: ImageEditorHeaderLeftProps) {
  const { t } = useAppTranslate();
  const routeBack = useRouteBack();

  return (
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
  );
}
