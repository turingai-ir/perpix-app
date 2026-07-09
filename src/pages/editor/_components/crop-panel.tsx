import { useAtom, useSetAtom, useAtomValue } from "jotai";
import * as store from "../_hooks/store";
import { useImageEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";

export function CropPanel() {
  const { t } = useAppTranslate();
  const { applyCrop } = useImageEditor();
  const [cropConfig, setCropConfig] = useAtom(store.cropConfigAtom);
  const currentDim = useAtomValue(store.currentDimensionsAtom);
  const setActiveTool = useSetAtom(store.activeToolAtom);

  const ratios = [
    { label: t("pages.editor.cropFree"), value: null },
    { label: "۱:۱", value: 1 },
    { label: "۱۶:۹", value: 16 / 9 },
    { label: "۴:۳", value: 4 / 3 },
  ];

  const selectRatio = (ratio: number | null) => {
    const w = currentDim.width,
      h = currentDim.height;
    if (ratio === null) {
      setCropConfig({ aspect: null, x: 0, y: 0, width: w, height: h });
    } else {
      let cw = w,
        ch = w / ratio;
      if (ch > h) {
        ch = h;
        cw = h * ratio;
      }
      setCropConfig({
        aspect: ratio,
        x: (w - cw) / 2,
        y: (h - ch) / 2,
        width: cw,
        height: ch,
      });
    }
  };

  return (
    <div className="mx-4 mb-4 flex flex-col gap-4 rounded-2xl border-t border-neutral-900/60 bg-neutral-950/80 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300">
      <div className="flex scrollbar-none justify-center gap-3 overflow-x-auto py-1">
        {ratios.map((r, i) => {
          const isSelected = cropConfig.aspect === r.value;
          const isDisabled =
            cropConfig.aspect !== null && r.value !== null && !isSelected;
          return (
            <Button
              key={i}
              variant={isSelected ? "default" : "outline"}
              onClick={() => selectRatio(r.value)}
              disabled={isDisabled}
              className={`rounded-full border-neutral-800 transition-all duration-200 hover:scale-105 active:scale-95 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              {r.label}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center justify-between border-t border-neutral-900 pt-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveTool("none")}
          className="rounded-full text-red-500 hover:bg-red-500/10"
        >
          <X className="h-5 w-5" />
        </Button>
        <span className="text-sm font-bold text-neutral-200">
          {t("pages.editor.cropImage")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={applyCrop}
          className="rounded-full text-green-500 hover:bg-green-500/10"
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
