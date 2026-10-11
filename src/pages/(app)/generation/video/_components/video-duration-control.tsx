import { Clock3 } from "lucide-react";
import { useEffect, useMemo, type CSSProperties } from "react";
import { useWatch } from "react-hook-form";

import styles from "../composer.module.css";
import { getDurationOptions } from "../_utils/duration-options";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppTranslate } from "@/hooks";
import {
  DynamicPromptConfigField,
  type DynamicConfigForm,
} from "@/pages/(app)/generation/_components/dynamic-config";

export function VideoDurationControl({
  disabled,
  dynamicForm,
}: {
  disabled: boolean;
  dynamicForm: DynamicConfigForm;
}) {
  const { t } = useAppTranslate();
  const meta = dynamicForm.getFieldMeta("duration");
  const schema = JSON.stringify(meta?.property);
  const options = useMemo(
    () => (schema ? getDurationOptions(JSON.parse(schema)) : null),
    [schema],
  );
  const current = useWatch({ control: dynamicForm.control, name: "duration" });
  const { form } = dynamicForm;
  const defaultValue = meta?.property.default ?? meta?.defaultValue;
  useEffect(() => {
    if (!options || options.values.some((value) => Object.is(value, current)))
      return;
    const fallback =
      options.values.find((value) => Object.is(value, defaultValue)) ??
      options.values[0];
    form.setValue("duration", fallback, { shouldValidate: true });
  }, [current, defaultValue, form, options]);

  if (!meta || !options) {
    return (
      <DynamicPromptConfigField
        dynamicForm={dynamicForm}
        fieldName="duration"
        disabled={disabled}
        layout="stacked"
      />
    );
  }

  const label = t("common.dynamicConfig.fields.duration");
  const format = (seconds: string | number) =>
    seconds === "auto"
      ? t("common.dynamicConfig.optionLabels.duration.auto", {
          defaultValue: meta.optionLabels?.auto ?? "auto",
        })
      : t("pages.generation.video.studio.durationValue", { seconds });
  const { values, start, end } = options;

  return (
    <FormField
      control={dynamicForm.control}
      name="duration"
      render={({ field }) => {
        const index = Math.max(
          0,
          values.findIndex((value) => Object.is(value, field.value)),
        );
        const selected = values[index];
        return (
          <FormItem className={styles.durationCard}>
            <div className={styles.durationHeading}>
              <FormLabel>{label}</FormLabel>
              <span className={styles.durationSelected} aria-hidden="true">
                <Clock3 size={16} />
                {format(selected)}
              </span>
            </div>
            <FormControl>
              <input
                ref={field.ref}
                type="range"
                min={start}
                max={end}
                step={1}
                value={start + index}
                disabled={disabled || values.length === 1}
                aria-valuetext={format(selected)}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  const value = values[next - start];
                  if (value !== undefined) field.onChange(value);
                }}
                className={styles.durationRange}
                style={
                  {
                    "--range-progress": `${end === start ? 0 : (index / (end - start)) * 100}%`,
                  } as CSSProperties
                }
              />
            </FormControl>
            <div className={styles.durationEnds} aria-hidden="true">
              <span>{format(values[0])}</span>
              <span>{format(values[values.length - 1])}</span>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
