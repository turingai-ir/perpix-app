import { useAtom, useAtomValue } from "jotai";
import * as store from "../_hooks/store";
import { EditorHeader } from "./editor-header";
import { EditorCanvas } from "./editor-canvas";
import { EditorToolbar } from "./editor-toolbar";
import { CropPanel } from "./crop-panel";
import { ResizePanel } from "./resize-panel";
import { FiltersPanel } from "./filters-panel";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorWorkspaceProps {
  onSave?: (dataUrl: string) => void;
}

export function EditorWorkspace({ onSave }: EditorWorkspaceProps) {
  const activeTool = useAtomValue(store.activeToolAtom);
  const loading = useAtomValue(store.loadingAtom);
  const [error, setError] = useAtom(store.errorAtom);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-neutral-950 text-neutral-100"
      dir="rtl"
    >
      <EditorHeader onSave={onSave} />

      <div className="relative w-full flex-1">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-neutral-200">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <span className="text-sm font-semibold tracking-wide">
                در حال بارگذاری تصویر...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-4 backdrop-blur-sm">
            <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center shadow-2xl">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <p className="text-sm font-bold text-neutral-200">{error}</p>
              <Button
                onClick={() => setError(null)}
                size="sm"
                className="rounded-full px-6"
              >
                تلاش مجدد
              </Button>
            </div>
          </div>
        )}

        <EditorCanvas />

        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-30 flex flex-col items-center justify-end p-4">
          <div className="pointer-events-auto w-full max-w-md">
            {activeTool === "none" && <EditorToolbar />}
            {activeTool === "crop" && <CropPanel />}
            {activeTool === "resize" && <ResizePanel />}
            {activeTool === "filter" && <FiltersPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
