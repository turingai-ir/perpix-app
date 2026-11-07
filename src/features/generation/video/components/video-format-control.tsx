import { Check, ChevronDown, MonitorPlay } from "lucide-react";
import { useState } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { useAppTranslate } from "@/shared/hooks";
import {
  DynamicPromptConfigField,
  type DynamicConfigForm,
} from "@/features/dynamic-config";
import { APP_I18_KEYS } from "@/shared/i18n";

type FormatField = "aspect_ratio" | "resolution";

function RatioGlyph({ value }: { value: string }) {
  const match = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(value);
  const ratio = match ? Number(match[1]) / Number(match[2]) : 1;
  return (
    <span
      className="inline-flex h-5.5 w-6.5 flex-none items-center justify-center"
      aria-hidden="true"
    >
      <span
        className="border-primary bg-primary/13 block h-[15px] max-w-[25px] min-w-2 rounded-xs border-[1.5px]"
        style={{ aspectRatio: String(Math.min(2.1, Math.max(0.48, ratio))) }}
      />
    </span>
  );
}

export function VideoFormatControl({
  disabled,
  dynamicForm,
  fieldName,
}: {
  disabled: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: FormatField;
}) {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const meta = dynamicForm.getFieldMeta(fieldName);
  const options = meta?.options?.filter(
    (value): value is string => typeof value === "string",
  );

  if (!meta || !options?.length || options.length !== meta.options?.length) {
    return (
      <DynamicPromptConfigField
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        disabled={disabled}
        layout="stacked"
      />
    );
  }

  const label = t(`common.dynamicConfig.fields.${fieldName}`, {
    ns: APP_I18_KEYS.RESOURCES.MAIN,
    defaultValue: meta.title ?? fieldName,
  });
  const optionLabel = (value: string) =>
    t(`common.dynamicConfig.optionLabels.${fieldName}.${value}`, {
      ns: APP_I18_KEYS.RESOURCES.MAIN,
      defaultValue: meta.optionLabels?.[value] ?? value,
    });
  const icon = (value: string) =>
    fieldName === "aspect_ratio" ? (
      <RatioGlyph value={value} />
    ) : (
      <MonitorPlay size={18} strokeWidth={1.7} aria-hidden="true" />
    );

  return (
    <FormField
      control={dynamicForm.control}
      name={fieldName}
      render={({ field }) => {
        const value =
          typeof field.value === "string"
            ? field.value
            : String(meta.defaultValue ?? options[0]);
        return (
          <FormItem className="grid content-start gap-1.5">
            <FormLabel className="text-muted-foreground text-xs font-semibold">
              {label}
            </FormLabel>
            <Popover open={open && !disabled} onOpenChange={setOpen}>
              <FormControl>
                <PopoverTrigger
                  render={
                    <button
                      ref={field.ref}
                      type="button"
                      disabled={disabled}
                      data-testid={`video-${fieldName}-control`}
                      className="border-border bg-background text-foreground hover-capable:hover:border-primary/50 hover-capable:hover:bg-accent focus-visible:outline-ring [&>svg:last-child]:text-muted-foreground flex min-h-11 w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-start transition-[border-color,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none [&>span:nth-child(2)]:flex-1 [&>span:nth-child(2)]:font-semibold [&>span:nth-child(2)]:tabular-nums"
                      aria-label={`${label}: ${optionLabel(value)}`}
                      onBlur={field.onBlur}
                    />
                  }
                >
                  {icon(value)}
                  <span dir="ltr">{optionLabel(value)}</span>
                  <ChevronDown size={15} aria-hidden="true" />
                </PopoverTrigger>
              </FormControl>
              <PopoverContent
                align="start"
                side="top"
                className="border-border bg-popover text-popover-foreground w-[min(300px,calc(100vw-32px))] rounded-[14px] border p-3 shadow-[0_18px_50px_rgb(0_0_0/45%)]"
              >
                <div className="text-muted-foreground px-0.5 pt-0.5 pb-2 text-xs font-bold">
                  {label}
                </div>
                <div className="grid max-h-65 grid-cols-3 gap-1.5 overflow-y-auto">
                  {options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="border-border bg-muted hover-capable:hover:border-primary/50 hover-capable:hover:bg-accent focus-visible:outline-ring data-[selected=true]:border-primary data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&>svg:last-child:not(:first-child)]:text-primary relative grid min-h-16 cursor-pointer content-center justify-items-center gap-1.5 rounded-[9px] border px-1 py-1.5 text-xs tabular-nums transition-[border-color,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none [&>svg:last-child:not(:first-child)]:absolute [&>svg:last-child:not(:first-child)]:end-1.5 [&>svg:last-child:not(:first-child)]:top-1.5"
                      data-selected={option === value}
                      aria-pressed={option === value}
                      onClick={() => {
                        field.onChange(option);
                        setOpen(false);
                      }}
                    >
                      {icon(option)}
                      <span dir="ltr">{optionLabel(option)}</span>
                      {option === value && (
                        <Check size={14} aria-hidden="true" />
                      )}
                    </button>
                  ))}
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
