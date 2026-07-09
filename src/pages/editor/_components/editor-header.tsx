import { useAtom } from "jotai";
import { useImageEditor } from "./editor-context";
import { EditorSaveMenu } from "./editor-save-menu";
import * as store from "../_hooks/store";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, ArrowLeft } from "lucide-react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { useRouteBack } from "@/hooks/use-route-back";

export function EditorHeader({
  onSave,
  onSaveToGallery,
}: {
  onSave?: (dataUrl: string) => void;
  onSaveToGallery?: (dataUrl: string) => Promise<void>;
}) {
  const routeBack = useRouteBack();
  const { t } = useAppTranslate();
  const { undo, redo } = useImageEditor();
  const [history] = useAtom(store.historyAtom);
  const [historyIndex] = useAtom(store.historyIndexAtom);
  const [saving] = useAtom(store.savingAtom);
  const [loading] = useAtom(store.loadingAtom);
  const [srcImage] = useAtom(store.srcImageAtom);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <header className="z-20 flex h-14 items-center justify-between border-b border-neutral-900/60 bg-neutral-950/80 px-4 text-neutral-200 shadow-sm backdrop-blur-xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={routeBack}
        disabled={loading || saving}
        aria-label={t("pages.editor.back")}
        className="rounded-full text-neutral-400 transition-all duration-200 hover:scale-105 hover:bg-neutral-900 hover:text-neutral-100 active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-1 rounded-full border border-neutral-800/80 bg-neutral-900/60 p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={!canUndo || loading || saving}
          className="h-8 w-8 rounded-full text-neutral-400 transition-all hover:bg-neutral-800 disabled:text-neutral-600"
        >
          <Undo2 className="h-4.5 w-4.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={!canRedo || loading || saving}
          className="h-8 w-8 rounded-full text-neutral-400 transition-all hover:bg-neutral-800 disabled:text-neutral-600"
        >
          <Redo2 className="h-4.5 w-4.5" />
        </Button>
      </div>

      <EditorSaveMenu
        disabled={loading || saving || !srcImage}
        saving={saving}
        srcImage={srcImage}
        onSave={onSave}
        onSaveToGallery={onSaveToGallery}
      />
    </header>
  );
}
