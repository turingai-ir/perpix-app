import type { FC } from "react";
import { Check, ChevronDown, Loader2, LockKeyhole } from "lucide-react";
import { ImageModelLogo } from "./model-logo";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { useModel } from "@/features/generation/hooks/use-model";
import { isModelAllowed } from "@/features/generation/model/model-access";
import { getModelStrength } from "../model/model-strength";
import { useModelDiscovery } from "../hooks/use-model-discovery";

interface ImageModelDiscoveryProps {
  disabled: boolean;
  model: ReturnType<typeof useModel>;
}

export const ImageModelDiscovery: FC<ImageModelDiscoveryProps> = ({
  disabled,
  model,
}) => {
  const {
    t,
    open,
    setOpen,
    openedWithTouch,
    popoverRef,
    models,
    selected,
    loading,
    allowedModelNames,
    isModelsError,
    handlePointerDown,
    handleKeyDown,
    handleSelectModel,
  } = useModelDiscovery(model);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled || loading}
            role="combobox"
            aria-expanded={open}
            aria-label={t("common.chooseModel")}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            className="bg-muted/40 hover:bg-muted/60 h-11 w-full max-w-full justify-start gap-3 rounded-xl px-3 transition-colors"
          />
        }
      >
        {loading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <ImageModelLogo
            name={selected?.name ?? ""}
            displayName={selected?.display_name}
            iconUrl={selected?.icon_url}
          />
        )}
        <span dir="ltr" className="min-w-0 flex-1 truncate text-start">
          {selected?.display_name ?? selected?.name ?? t("common.chooseModel")}
        </span>
        <ChevronDown className="text-muted-foreground size-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        tabIndex={-1}
        side="top"
        align="end"
        sideOffset={12}
        collisionPadding={16}
        initialFocus={() =>
          openedWithTouch.current ? popoverRef.current : true
        }
        className="border-border max-h-(--available-height) w-[min(460px,calc(100vw-2rem))] overflow-hidden rounded-2xl border p-1.5 shadow-2xl"
      >
        <Command className="h-auto min-h-0">
          <CommandInput
            placeholder={t("pages.generation.image.studio.searchModels")}
          />
          <CommandList className="max-h-[min(440px,calc(100dvh-12rem))] min-h-0 flex-1">
            <CommandEmpty>
              {t(
                isModelsError
                  ? "pages.generation.image.studio.modelError"
                  : "pages.generation.image.studio.noResults",
              )}
            </CommandEmpty>
            {models.map((item) => {
              const active = item.uuid === model.currentModel;
              const allowed = isModelAllowed(item, allowedModelNames);
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
                  onSelect={() => handleSelectModel(item.uuid)}
                  className="data-[selected=true]:border-primary/30 data-[selected=true]:bg-primary/5 my-1 cursor-pointer gap-3 rounded-xl border border-transparent p-3"
                >
                  <span className="bg-muted flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <ImageModelLogo
                      name={item.name}
                      displayName={item.display_name}
                      iconUrl={item.icon_url}
                    />
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
};
