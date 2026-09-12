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
          className="bg-muted/40 h-11 max-w-full gap-3 rounded-xl px-3"
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ImageModelLogo name={selected?.name ?? ""} />
          )}
          <span dir="ltr" className="truncate">
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
        className="w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-2xl p-1.5 shadow-2xl"
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
              return (
                <CommandItem
                  key={item.uuid}
                  value={`${item.display_name} ${item.name}`}
                  disabled={disabled}
                  onSelect={() => {
                    model.setCurrentModel(item.uuid);
                    setOpen(false);
                  }}
                  className="data-[selected=true]:bg-muted my-1 cursor-pointer gap-3 rounded-xl p-3"
                >
                  <span className="bg-muted flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <ImageModelLogo name={item.name} />
                  </span>
                  <span className="min-w-0 flex-1 text-start">
                    <span dir="ltr" className="block text-start font-semibold">
                      {item.display_name ?? item.name}
                    </span>
                    <span className="text-muted-foreground mt-1 block text-xs leading-5">
                      {item.description ||
                        t("pages.generation.image.studio.modelFallback")}
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
