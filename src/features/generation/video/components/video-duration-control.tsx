import { Clock3 } from "lucide-react";
import { useEffect, useMemo, type CSSProperties } from "react";
import { useWatch } from "react-hook-form";

import { getDurationOptions } from "../model/duration-options";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { useAppTranslate } from "@/shared/hooks";
import {
  DynamicPromptConfigField,
  type DynamicConfigForm,
} from "@/features/dynamic-config";

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
          <FormItem className="col-span-full">
            <div className="flex items-center justify-between gap-2.5">
              <FormLabel className="text-xs">{label}</FormLabel>
              <span
                className="text-primary inline-flex items-center gap-1.5 text-sm font-bold whitespace-nowrap tabular-nums"
                aria-hidden="true"
              >
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
                className="[&::-moz-range-track]:bg-input [&::-moz-range-progress]:bg-primary [&::-webkit-slider-thumb]:border-primary [&::-moz-range-thumb]:border-primary mt-1 block h-7 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-wait disabled:opacity-45 [&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-full [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_2px_10px_rgb(0_0_0/40%)] [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_left,var(--primary)_var(--range-progress),var(--input)_var(--range-progress))] [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_10px_rgb(0_0_0/40%)]"
                style={
                  {
                    "--range-progress": `${end === start ? 0 : (index / (end - start)) * 100}%`,
                  } as CSSProperties
                }
              />
            </FormControl>
            <div
              className="text-muted-foreground flex justify-between text-xs tabular-nums"
              aria-hidden="true"
            >
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
