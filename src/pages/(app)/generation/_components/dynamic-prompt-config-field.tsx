import type { FC } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppTranslate } from "@/hook";
import type { useDynamicConfigForm } from "@/hooks/use-dynamic-config-form";
import { APP_I18_KEYS } from "@/services/i18";
import { cn } from "@/lib/utils";

type DynamicConfigForm = ReturnType<typeof useDynamicConfigForm>;
type FieldLayout = "inline" | "stacked";
const HIDDEN_CONFIG_FIELD_NAMES = new Set(["seed", "n", "delivery_method"]);

function coerceSelectValue(
  value: string,
  options?: readonly (string | number)[],
) {
  const matchingOption = options?.find((option) => String(option) === value);

  return matchingOption ?? value;
}

function resolveFieldValue(value: unknown, defaultValue: unknown) {
  return value ?? defaultValue;
}

export function getPromptConfigFieldNames({
  dynamicForm,
  excludedFields,
  includedFields,
}: {
  dynamicForm: DynamicConfigForm;
  excludedFields?: ReadonlySet<string>;
  includedFields?: ReadonlySet<string>;
}) {
  return dynamicForm.orderedFieldNames.filter((fieldName) => {
    const widget = dynamicForm.configSchema["x-ui"]?.widgets?.[fieldName];
    const meta = dynamicForm.getFieldMeta(fieldName);

    if (!meta || meta.inputType === "unknown") return false;
    if (meta.inputType === "hidden") return false;
    if (HIDDEN_CONFIG_FIELD_NAMES.has(fieldName)) return false;
    if (excludedFields?.has(fieldName)) return false;
    if (includedFields && !includedFields.has(fieldName)) return false;
    if (widget === "hidden" || !dynamicForm.isFieldVisible(fieldName)) {
      return false;
    }

    return ["select", "number", "checkbox"].includes(meta.inputType);
  });
}

export const DynamicPromptConfigField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  layout?: FieldLayout;
}> = ({ disabled, dynamicForm, fieldName, layout = "inline" }) => {
  const { t } = useAppTranslate();
  const meta = dynamicForm.getFieldMeta(fieldName);

  if (!meta) return null;

  const labelKey = `common.dynamicConfig.fields.${fieldName}`;
  const label = t(labelKey, {
    ns: APP_I18_KEYS.RESOURCES.MAIN,
    defaultValue: meta.title ?? fieldName,
  });
  const isStacked = layout === "stacked";
  const formItemClassName = cn(
    "gap-2",
    isStacked
      ? "flex w-full flex-col items-stretch"
      : "flex w-full flex-col items-stretch md:w-auto md:flex-row md:items-center",
  );
  const labelClassName = cn(
    "text-sm font-normal whitespace-nowrap",
    isStacked && "text-muted-foreground",
  );
  const controlClassName = isStacked ? "w-full" : "w-full md:min-w-32";

  if (meta.inputType === "select") {
    return (
      <FormField
        control={dynamicForm.control}
        defaultValue={meta.defaultValue}
        name={fieldName}
        render={({ field, fieldState }) => (
          <FormItem className={formItemClassName}>
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <Select
              name={field.name}
              value={
                resolveFieldValue(field.value, meta.defaultValue) == null
                  ? ""
                  : String(resolveFieldValue(field.value, meta.defaultValue))
              }
              onValueChange={(value) =>
                field.onChange(coerceSelectValue(value, meta.options))
              }
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger
                  className={controlClassName}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder={label} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {(meta.options ?? []).map((option) => (
                    <SelectItem key={String(option)} value={String(option)}>
                      {meta.optionLabels?.[String(option)] ?? String(option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    );
  }

  if (meta.inputType === "number") {
    return (
      <FormField
        control={dynamicForm.control}
        defaultValue={meta.defaultValue}
        name={fieldName}
        render={({ field, fieldState }) => (
          <FormItem className={formItemClassName}>
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <FormControl>
              <Input
                name={field.name}
                value={
                  resolveFieldValue(field.value, meta.defaultValue) == null
                    ? ""
                    : String(resolveFieldValue(field.value, meta.defaultValue))
                }
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.value)}
                ref={field.ref}
                type="number"
                min={meta.property.minimum}
                max={meta.property.maximum}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
                placeholder={label}
                className={isStacked ? "w-full" : "w-full md:w-32"}
              />
            </FormControl>
          </FormItem>
        )}
      />
    );
  }

  if (meta.inputType === "checkbox") {
    return (
      <FormField
        control={dynamicForm.control}
        defaultValue={meta.defaultValue}
        name={fieldName}
        render={({ field }) => (
          <FormItem
            className={cn(
              "border-input flex min-h-8 items-center gap-2 rounded-lg border px-2.5",
              isStacked ? "w-full" : "w-full md:w-auto",
            )}
          >
            <FormControl>
              <Checkbox
                name={field.name}
                checked={Boolean(
                  resolveFieldValue(field.value, meta.defaultValue),
                )}
                onBlur={field.onBlur}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                ref={field.ref}
                disabled={disabled}
              />
            </FormControl>
            <FormLabel className="cursor-pointer text-sm font-normal whitespace-nowrap">
              {label}
            </FormLabel>
          </FormItem>
        )}
      />
    );
  }

  return null;
};

export const AdvancedPromptSettingsDialog: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldNames: readonly string[];
}> = ({ disabled, dynamicForm, fieldNames }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  if (fieldNames.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full md:w-auto"
          disabled={disabled}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("common.advancedSettings")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("common.advancedSettings")}</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col gap-3">
          {fieldNames.map((fieldName) => (
            <DynamicPromptConfigField
              key={fieldName}
              dynamicForm={dynamicForm}
              fieldName={fieldName}
              disabled={disabled}
              layout="stacked"
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
