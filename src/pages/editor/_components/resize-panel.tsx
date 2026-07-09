import { useAtom, useAtomValue, useSetAtom } from "jotai";
import * as store from "../_hooks/store";
import { useImageEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Link as LinkIcon, Link2Off } from "lucide-react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";

export function ResizePanel() {
  const { t } = useAppTranslate();
  const { applyResize } = useImageEditor();
  const [resizeConfig, setResizeConfig] = useAtom(store.resizeConfigAtom);
  const currentDim = useAtomValue(store.currentDimensionsAtom);
  const setActiveTool = useSetAtom(store.activeToolAtom);
  const aspect = currentDim.width / currentDim.height;

  const handleChange = (key: "width" | "height", val: string) => {
    const value = parseInt(val, 10) || 0;
    if (resizeConfig.lockAspectRatio && value > 0) {
      const otherKey = key === "width" ? "height" : "width";
      const otherValue =
        key === "width"
          ? Math.round(value / aspect)
          : Math.round(value * aspect);
      setResizeConfig({
        ...resizeConfig,
        [key]: value,
        [otherKey]: otherValue,
      });
    } else {
      setResizeConfig({ ...resizeConfig, [key]: value });
    }
  };

  return (
    <div className="mx-4 mb-4 flex flex-col gap-4 rounded-2xl border-t border-neutral-900/60 bg-neutral-950/80 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center justify-center gap-4 py-1">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-semibold text-neutral-400">
            {t("pages.editor.widthPx")}
          </span>
          <Input
            type="number"
            value={resizeConfig.width || ""}
            onChange={(e) => handleChange("width", e.target.value)}
            className="focus:border-primary h-9 w-24 border-neutral-800 bg-neutral-900 text-center text-neutral-100"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setResizeConfig({
              ...resizeConfig,
              lockAspectRatio: !resizeConfig.lockAspectRatio,
            })
          }
          className="mt-5 h-9 w-9 rounded-full text-neutral-300 hover:bg-neutral-900"
        >
          {resizeConfig.lockAspectRatio ? (
            <LinkIcon className="text-primary h-4.5 w-4.5" />
          ) : (
            <Link2Off className="h-4.5 w-4.5" />
          )}
        </Button>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-semibold text-neutral-400">
            {t("pages.editor.heightPx")}
          </span>
          <Input
            type="number"
            value={resizeConfig.height || ""}
            onChange={(e) => handleChange("height", e.target.value)}
            className="focus:border-primary h-9 w-24 border-neutral-800 bg-neutral-900 text-center text-neutral-100"
          />
        </div>
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
          {t("pages.editor.resizeImage")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={applyResize}
          className="rounded-full text-green-500 hover:bg-green-500/10"
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
