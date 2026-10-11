import { Check, ChevronDown, MonitorPlay } from "lucide-react";
import { useState } from "react";

import styles from "../composer.module.css";
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
import {
  DynamicPromptConfigField,
  type DynamicConfigForm,
} from "@/pages/(app)/generation/_components/dynamic-config";
import { APP_I18_KEYS } from "@/services/i18";

type FormatField = "aspect_ratio" | "resolution";

function RatioGlyph({ value }: { value: string }) {
  const match = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(value);
  const ratio = match ? Number(match[1]) / Number(match[2]) : 1;
  return (
    <span className={styles.ratioGlyph} aria-hidden="true">
      <span
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
          <FormItem className={styles.formatCard}>
            <FormLabel>{label}</FormLabel>
            <Popover open={open && !disabled} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    ref={field.ref}
                    type="button"
                    disabled={disabled}
                    data-testid={`video-${fieldName}-control`}
                    className={styles.formatTrigger}
                    aria-label={`${label}: ${optionLabel(value)}`}
                    onBlur={field.onBlur}
                  >
                    {icon(value)}
                    <span dir="ltr">{optionLabel(value)}</span>
                    <ChevronDown size={15} aria-hidden="true" />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="top"
                className={styles.formatPopover}
              >
                <div className={styles.formatPopoverTitle}>{label}</div>
                <div className={styles.formatOptions}>
                  {options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={styles.formatOption}
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
