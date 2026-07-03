import type { FC } from "react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";

import { coerceSelectValue, resolveFieldValue } from "../../schema";
import type { DynamicConfigForm, DynamicConfigOptions } from "../../types";
import type { FieldLayoutClasses } from "./field-layout";

export const DynamicConfigSelectField: FC<{
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
    render={({ field, fieldState }) => (
      <FormItem className={classes.item}>
        <FormLabel className={classes.label}>{label}</FormLabel>
        <Select
          name={field.name}
          value={
            resolveFieldValue(field.value, property.default) == null
              ? ""
              : String(resolveFieldValue(field.value, property.default))
          }
          onValueChange={(value) =>
            field.onChange(coerceSelectValue(value, options))
          }
          disabled={disabled}
        >
          <FormControl>
            <SelectTrigger
              className={classes.control}
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder={label} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {options.map((option) => (
                <SelectItem key={String(option)} value={String(option)}>
                  {optionLabels?.[String(option)] ?? String(option)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {hint ? (
          <FormDescription className={classes.hint}>{hint}</FormDescription>
        ) : null}
      </FormItem>
    )}
  />
);
