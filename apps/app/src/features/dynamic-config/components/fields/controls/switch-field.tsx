import type { FC } from "react";

import { Button } from "@/shared/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { ScrollArea } from "@/shared/ui/scroll-area";
import type { JsonSchemaProperty } from "@/features/dynamic-config/hooks/use-dynamic-config-form.ts";
import { cn } from "@/shared/lib/utils";

import {
  coerceSelectValue,
  resolveFieldValue,
} from "../../../model/field-schema";
import type {
  DynamicConfigForm,
  DynamicConfigOptions,
} from "../../../model/field-types";
import type { FieldLayoutClasses } from "./field-layout";

export const DynamicConfigSwitchField: FC<{
  classes: FieldLayoutClasses;
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  hint?: string;
  label: string;
  optionLabels?: Record<string, string>;
  options: DynamicConfigOptions;
  property: JsonSchemaProperty;
}> = ({
  classes,
  disabled,
  dynamicForm,
  fieldName,
  hint,
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
          <FormControl>
            <ScrollArea
              role="group"
              aria-label={label}
              className={cn(classes.control, "min-w-0")}
              viewportClassName="overflow-x-auto"
              orientation="horizontal"
            >
              <div className="inline-flex h-9 w-max items-center gap-1 rounded-lg border border-input bg-muted/50 p-1 dark:bg-input/20">
                {options.map((option) => {
                  const optionStr = String(option);
                  const isSelected = currentValue === optionStr;
                  return (
                    <Button
                      key={optionStr}
                      type="button"
                      aria-pressed={isSelected}
                      variant={isSelected ? "secondary" : "ghost"}
                      size="xs"
                      className={`h-7 shrink-0 rounded-md px-3 text-xs transition-[color,background-color,border-color,box-shadow,opacity,transform] ${
                        isSelected
                          ? "bg-background font-semibold text-foreground shadow-xs dark:bg-muted"
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
            </ScrollArea>
          </FormControl>
          {hint ? (
            <FormDescription className={classes.hint}>{hint}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      );
    }}
  />
);
