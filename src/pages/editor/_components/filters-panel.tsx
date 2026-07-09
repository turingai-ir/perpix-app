import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import * as store from "../_hooks/store";
import { useImageEditor } from "./editor-context";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { FiltersState, FilterPreset } from "../_model/types";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";

const sliders = [
  { key: "brightness", min: -1, max: 1, step: 0.05 },
  { key: "contrast", min: -100, max: 100, step: 5 },
  { key: "blur", min: 0, max: 40, step: 1 },
];

const presetGroups = {
  color: [
    "none",
    "grayscale",
    "sepia",
    "invert",
    "solarize",
    "vivid",
    "noise",
  ] as FilterPreset[],
  cinematic: [
    "cinematic",
    "dramatic",
    "noir",
    "matte",
    "lomo",
    "retro",
    "fade",
    "cyberpunk",
  ] as FilterPreset[],
  atmosphere: [
    "warm",
    "cool",
    "golden",
    "rosy",
    "forest",
    "winter",
    "vintage",
  ] as FilterPreset[],
};

export function FiltersPanel() {
  const { t } = useAppTranslate();
  const { applyFilters } = useImageEditor();
  const [filters, setFilters] = useAtom(store.filtersAtom);
  const setActiveTool = useSetAtom(store.activeToolAtom);
  const [tab, setTab] = useState<
    "manual" | "color" | "cinematic" | "atmosphere"
  >("manual");

  const presetGradients: Record<FilterPreset, string> = {
    none: "from-neutral-700 to-neutral-800",
    grayscale: "from-neutral-500 to-neutral-700",
    sepia: "from-amber-700 to-yellow-800",
    vintage: "from-amber-600 to-orange-700",
    warm: "from-orange-500 to-amber-600",
    cool: "from-blue-500 to-cyan-600",
    vivid: "from-pink-500 to-purple-600",
    dramatic: "from-gray-700 to-stone-900",
    cinematic: "from-cyan-700 to-amber-600",
    cyberpunk: "from-fuchsia-600 to-cyan-500",
    golden: "from-yellow-500 to-orange-500",
    noir: "from-neutral-900 to-neutral-950",
    matte: "from-zinc-500 to-stone-600",
    lomo: "from-rose-500 to-indigo-600",
    retro: "from-red-500 to-yellow-600",
    rosy: "from-rose-400 to-pink-500",
    forest: "from-green-700 to-emerald-500",
    winter: "from-sky-300 to-blue-500",
    invert: "from-white to-black",
    fade: "from-slate-400 to-zinc-400",
    solarize: "from-purple-800 to-orange-600",
    noise: "from-neutral-600 to-neutral-400",
  };

  return (
    <div className="flex max-h-[340px] w-full flex-col gap-4 border-t border-neutral-900/60 bg-neutral-950/80 p-4 backdrop-blur-xl transition-all duration-300">
      <div className="flex scrollbar-none gap-1 overflow-x-auto border-b border-neutral-900 pb-2">
        {["manual", "color", "cinematic", "atmosphere"].map((id) => (
          <button
            type="button"
            key={id}
            onClick={() => setTab(id as any)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              tab === id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
            }`}
          >
            {t(`pages.editor.categories.${id}`)}
          </button>
        ))}
      </div>

      <div className="min-h-[120px] flex-1">
        {tab === "manual" ? (
          <div className="flex flex-col gap-4">
            {sliders.map((cfg) => {
              const val = filters[cfg.key as keyof FiltersState] as number;
              const displayVal =
                cfg.key === "brightness"
                  ? `${Math.round(val * 100)}%`
                  : `${Math.round(val)}`;
              return (
                <div key={cfg.key} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium text-neutral-300">
                    <span>{t(`pages.editor.${cfg.key}`)}</span>
                    <span className="text-primary font-bold">{displayVal}</span>
                  </div>
                  <input
                    type="range"
                    min={cfg.min}
                    max={cfg.max}
                    step={cfg.step}
                    value={val}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        [cfg.key]:
                          cfg.key === "blur"
                            ? parseInt(e.target.value, 10)
                            : parseFloat(e.target.value),
                      })
                    }
                    className="accent-primary h-1 w-full cursor-pointer appearance-none rounded-lg bg-neutral-800"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex scrollbar-none gap-3 overflow-x-auto py-1">
            {presetGroups[tab as keyof typeof presetGroups].map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setFilters({ ...filters, preset: p })}
                className="group flex shrink-0 flex-col items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <div
                  className={`h-16 w-16 rounded-xl bg-gradient-to-tr ${presetGradients[p]} flex items-center justify-center p-0.5 shadow-md transition-all duration-200 ${
                    filters.preset === p
                      ? "ring-primary scale-95 ring-2 ring-offset-2 ring-offset-neutral-950"
                      : "opacity-85 group-hover:opacity-100"
                  }`}
                >
                  <span className="max-w-full truncate px-1 text-center text-[10px] font-bold text-white drop-shadow-md">
                    {t(`pages.editor.presets.${p}`)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-neutral-900 pt-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setFilters({ brightness: 0, contrast: 0, blur: 0, preset: "none" });
            setActiveTool("none");
          }}
          className="rounded-full text-red-500 hover:bg-red-500/10"
        >
          <X className="h-5 w-5" />
        </Button>
        <span className="text-sm font-bold text-neutral-200">
          {t("pages.editor.filtersTitle")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={applyFilters}
          className="rounded-full text-green-500 hover:bg-green-500/10"
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
