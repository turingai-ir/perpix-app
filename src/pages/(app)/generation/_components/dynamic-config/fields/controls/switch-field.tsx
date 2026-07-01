import type { FC } from "react";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";

import { coerceSelectValue, resolveFieldValue } from "../../schema";
import type { DynamicConfigForm, DynamicConfigOptions } from "../../types";
import type { FieldLayoutClasses } from "./field-layout";

export const DynamicConfigSwitchField: FC<{
  classes: FieldLayoutClasses;
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  label: string;
  optionLabels?: Record<string, string>;
  options: DynamicConfigOptions;
  property: JsonSchemaProperty;
}> = ({
  classes,
  disabled,
  dynamicForm,
  fieldName,
  label,
  optionLabels,
  options,
  property,
}) => (
  <FormField
    control={dynamicForm.control}
    name={fieldName}
    render={({ field }) => {
      const currentValue =
        resolveFieldValue(field.value, property.default) == null
          ? ""
          : String(resolveFieldValue(field.value, property.default));

      return (
        <FormItem className={classes.item}>
          <FormLabel className={classes.label}>{label}</FormLabel>
          <FormControl>
            <div className="bg-muted/50 border-input inline-flex h-9 items-center gap-1 rounded-lg border p-1 dark:bg-input/20">
              {options.map((option) => {
                const optionStr = String(option);
                const isSelected = currentValue === optionStr;
                return (
                  <Button
                    key={optionStr}
                    type="button"
                    variant={isSelected ? "secondary" : "ghost"}
                    size="xs"
                    className={`h-7 px-3 rounded-[6px] text-xs transition-all ${
                      isSelected
                        ? "bg-background shadow-xs text-foreground font-semibold dark:bg-muted"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    disabled={disabled}
                    onClick={() => {
                      field.onChange(coerceSelectValue(optionStr, options));
                    }}
                  >
                    {optionLabels?.[optionStr] ?? optionStr}
                  </Button>
                );
              })}
            </div>
          </FormControl>
        </FormItem>
      );
    }}
  />
);
