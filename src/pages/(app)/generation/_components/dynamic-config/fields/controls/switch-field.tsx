import type { FC } from "react";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";
import { cn } from "@/lib/utils";

import { coerceSelectValue, resolveFieldValue } from "../../schema";
import type { DynamicConfigForm, DynamicConfigOptions } from "../../types";
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
              className={cn(classes.control, "min-w-0")}
              viewportClassName="overflow-x-auto"
              orientation="horizontal"
            >
              <div className="bg-muted/50 border-input dark:bg-input/20 inline-flex h-9 w-max items-center gap-1 rounded-lg border p-1">
                {options.map((option) => {
                  const optionStr = String(option);
                  const isSelected = currentValue === optionStr;
                  return (
                    <Button
                      key={optionStr}
                      type="button"
                      variant={isSelected ? "secondary" : "ghost"}
                      size="xs"
                      className={`h-7 shrink-0 rounded-[6px] px-3 text-xs transition-all ${
                        isSelected
                          ? "bg-background text-foreground dark:bg-muted font-semibold shadow-xs"
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
        </FormItem>
      );
    }}
  />
);
