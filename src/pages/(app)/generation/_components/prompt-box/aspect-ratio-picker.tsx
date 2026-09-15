import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

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

function RatioShape({
  ratio,
  large = false,
}: {
  ratio: string;
  large?: boolean;
}) {
  const [widthValue, heightValue] = ratio.split(":").map(Number);
  const width = Number.isFinite(widthValue) ? widthValue : 1;
  const height = Number.isFinite(heightValue) ? heightValue : 1;
  const maxSize = large ? 28 : 18;
  const scale = maxSize / Math.max(width, height);
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-[3px] border-2 border-current"
      style={{
        width: Math.max(8, Math.round(width * scale)),
        height: Math.max(8, Math.round(height * scale)),
      }}
    />
  );
}

export function AspectRatioPicker({
  dynamicForm,
  disabled,
}: {
  dynamicForm: DynamicConfigForm;
  disabled?: boolean;
}) {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const options = dynamicForm.getFieldMeta("aspect_ratio")?.options ?? [];
  const label = t("pages.generation.image.studio.fields.aspect_ratio");
  if (!options.length) return null;
  return (
    <FormField
      control={dynamicForm.control}
      name="aspect_ratio"
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
                    <RatioShape ratio={value} />
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
                className="border-border w-[min(220px,calc(100vw-2rem))] rounded-2xl border p-3 shadow-2xl"
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
                        className="hover:bg-muted data-[selected=true]:bg-muted focus-visible:ring-ring flex min-h-14 items-center gap-3 rounded-xl px-3 text-start outline-none focus-visible:ring-2"
                        data-selected={selected || undefined}
                        onClick={() => {
                          field.onChange(option);
                          setOpen(false);
                        }}
                      >
                        <span className="text-muted-foreground grid size-8 shrink-0 place-items-center">
                          <RatioShape ratio={optionValue} large />
                        </span>
                        <bdi dir="ltr" className="font-medium">
                          {optionValue}
                        </bdi>
                        {selected && (
                          <Check
                            aria-hidden="true"
                            className="text-primary ms-auto size-4"
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
