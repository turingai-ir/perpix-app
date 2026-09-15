import { useState } from "react";
import { Check, ChevronDown, Gem } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppTranslate } from "@/hooks";
import type { DynamicConfigForm } from "../dynamic-config";

function resolutionHint(
  value: string,
  t: ReturnType<typeof useAppTranslate>["t"],
) {
  const numeric = Number.parseFloat(value.replace(/[^\d.]/g, ""));
  if (/k/i.test(value)) {
    if (numeric >= 4)
      return t("pages.generation.image.studio.resolution.maximum");
    if (numeric >= 2)
      return t("pages.generation.image.studio.resolution.balanced");
  } else if (numeric >= 3000)
    return t("pages.generation.image.studio.resolution.maximum");
  else if (numeric >= 1800)
    return t("pages.generation.image.studio.resolution.balanced");
  return t("pages.generation.image.studio.resolution.fast");
}

export function ResolutionPicker({
  dynamicForm,
  disabled,
}: {
  dynamicForm: DynamicConfigForm;
  disabled?: boolean;
}) {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const options = dynamicForm.getFieldMeta("resolution")?.options ?? [];
  const label = t("pages.generation.image.studio.fields.resolution");
  if (!options.length) return null;
  return (
    <FormField
      control={dynamicForm.control}
      name="resolution"
      render={({ field }) => {
        const value = String(field.value ?? options[0]);
        return (
          <FormItem>
            <FormLabel className="sr-only">{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="bg-muted/40 h-11 min-w-24 gap-2 rounded-xl px-3"
                  >
                    <Gem
                      aria-hidden="true"
                      className="text-muted-foreground size-4"
                    />
                    <bdi dir="ltr" className="font-semibold">
                      {value}
                    </bdi>
                    <ChevronDown
                      aria-hidden="true"
                      className="text-muted-foreground ms-auto size-4"
                    />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                sideOffset={10}
                className="border-border w-[min(300px,calc(100vw-2rem))] rounded-2xl border p-3 shadow-2xl"
              >
                <p className="px-1 pb-3 text-sm font-semibold">{label}</p>
                <div className="flex max-h-[min(480px,calc(100dvh-10rem))] [scrollbar-width:none] flex-col gap-1 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {options.map((option) => {
                    const optionValue = String(option);
                    const selected = optionValue === value;
                    return (
                      <button
                        key={optionValue}
                        type="button"
                        aria-pressed={selected}
                        className="hover:bg-muted data-[selected=true]:bg-muted focus-visible:ring-ring flex min-h-15 items-center gap-3 rounded-xl px-3 text-start outline-none focus-visible:ring-2"
                        data-selected={selected}
                        onClick={() => {
                          field.onChange(option);
                          setOpen(false);
                        }}
                      >
                        <span className="min-w-0 flex-1">
                          <bdi dir="ltr" className="block font-semibold">
                            {optionValue}
                          </bdi>
                          <span className="text-muted-foreground block text-xs leading-5">
                            {resolutionHint(optionValue, t)}
                          </span>
                        </span>
                        {selected && (
                          <Check
                            aria-hidden="true"
                            className="text-primary size-4 shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
