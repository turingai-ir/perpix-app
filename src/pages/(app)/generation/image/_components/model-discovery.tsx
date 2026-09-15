import { useState } from "react";
import { Check, ChevronDown, Loader2, LockKeyhole } from "lucide-react";
import { ImageModelLogo } from "./model-logo";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppTranslate } from "@/hooks";
import type { useModel } from "@/pages/(app)/generation/_hooks/model";
import { isModelAllowed } from "@/pages/(app)/generation/_utils/model-access";

type Props = { disabled: boolean; model: ReturnType<typeof useModel> };

function getModelStrength(
  description?: string | null,
  name?: string | null,
  displayName?: string | null,
) {
  const source = `${name ?? ""} ${displayName ?? ""} ${description ?? ""}`
    .replace(/_/g, " ")
    .toLowerCase();
  const strengths: Array<[RegExp, string]> = [
    [/image auto/, "imageAuto"],
    [/soul cinema.*1[ .]?5/, "soulCinema15"],
    [/soul cinema/, "soulCinema"],
    [/soul.*2(?:[ .]?0)?/, "soul2"],
    [/\bsoul\b/, "soul"],
    [/gpt image.*sunburst/, "gptSunburst"],
    [/gpt image.*flare/, "gptFlare"],
    [/gpt image/, "gptImage"],
    [/nano banana.*2.*lite|nano banana.*lite/, "nanoLite"],
    [/nano banana.*flash/, "nanoFlash"],
    [/nano banana.*pro/, "nanoPro"],
    [/nano banana.*2/, "nano2"],
    [/nano banana/, "nano"],
    [/flux.*kontext/, "fluxKontext"],
    [/flux.*2.*max/, "fluxMax"],
    [/flux.*2.*flex/, "fluxFlex"],
    [/flux.*2|flux.*pro/, "flux"],
    [/seedream.*5.*pro/, "seedreamPro"],
    [/seedream.*5.*lite/, "seedreamLite"],
    [/seedream/, "seedream"],
    [/recraft.*util/, "recraftUtility"],
    [/recraft.*style/, "recraftStyles"],
    [/recraft/, "recraft"],
    [/character swap/, "characterSwap"],
    [/face swap/, "faceSwap"],
    [/kling.*o1/, "kling"],
    [/grok.*2(?:[ .]?0)?/, "grok2"],
    [/grok/, "grok"],
    [/wan.*2[ .]?2/, "wan"],
    [/z[- ]?image/, "zImage"],
    [/hazel/, "hazel"],
  ];
  const match = strengths.find(([pattern]) => pattern.test(source));
  if (match) return match[1];
  if (/edit|inpaint|replace|retouch|transform/.test(source)) return "edit";
  if (/typograph|text render|logo|poster/.test(source)) return "text";
  if (/photo|realistic|portrait|cinematic/.test(source)) return "photo";
  if (/illustrat|artistic|anime|design/.test(source)) return "art";
  if (/fast|turbo|lite|speed|schnell/.test(source)) return "fast";
  return "general";
}

export function ImageModelDiscovery({ disabled, model }: Props) {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const models = model.modelsListState.data ?? [];
  const selected = models.find((item) => item.uuid === model.currentModel);
  const loading = model.modelsListState.isLoading;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || loading}
          role="combobox"
          aria-expanded={open}
          aria-label={t("common.chooseModel")}
          className="bg-muted/40 hover:bg-muted/60 h-11 w-full max-w-full justify-start gap-3 rounded-xl px-3 transition-colors"
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ImageModelLogo name={selected?.name ?? ""} />
          )}
          <span dir="ltr" className="min-w-0 flex-1 truncate text-start">
            {selected?.display_name ??
              selected?.name ??
              t("common.chooseModel")}
          </span>
          <ChevronDown className="text-muted-foreground size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={12}
        className="border-border w-[min(460px,calc(100vw-2rem))] overflow-hidden rounded-2xl border p-1.5 shadow-2xl"
      >
        <Command>
          <CommandInput
            placeholder={t("pages.generation.image.studio.searchModels")}
          />
          <CommandList className="max-h-[min(440px,calc(100dvh-12rem))]">
            <CommandEmpty>
              {t(
                model.modelsListState.isError
                  ? "pages.generation.image.studio.modelError"
                  : "pages.generation.image.studio.noResults",
              )}
            </CommandEmpty>
            {models.map((item) => {
              const active = item.uuid === model.currentModel;
              const allowed = isModelAllowed(item, model.allowedModelNames);
              const strength = getModelStrength(
                item.description,
                item.name,
                item.display_name,
              );
              return (
                <CommandItem
                  key={item.uuid}
                  value={`${item.display_name} ${item.name}`}
                  disabled={disabled}
                  onSelect={() => {
                    model.setCurrentModel(item.uuid);
                    setOpen(false);
                  }}
                  className="data-[selected=true]:border-primary/30 data-[selected=true]:bg-primary/5 my-1 cursor-pointer gap-3 rounded-xl border border-transparent p-3"
                >
                  <span className="bg-muted flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <ImageModelLogo name={item.name} />
                  </span>
                  <span className="min-w-0 flex-1 text-start">
                    <span dir="ltr" className="block text-start font-semibold">
                      {item.display_name ?? item.name}
                    </span>
                    <span className="text-muted-foreground mt-1 block text-xs leading-5 sm:whitespace-nowrap">
                      {t(
                        `pages.generation.image.studio.modelStrengths.${strength}`,
                      )}
                    </span>
                    {!allowed && (
                      <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <LockKeyhole className="size-3" />
                        {t("common.upgradeRequired")}
                      </span>
                    )}
                  </span>
                  {active && (
                    <Check
                      className="text-primary size-4 shrink-0"
                      aria-label={t("pages.generation.image.studio.selected")}
                    />
                  )}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
