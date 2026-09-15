import type { FC } from "react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";

import { resolveFieldValue } from "../../schema";
import type { DynamicConfigForm } from "../../types";
import type { FieldLayoutClasses } from "./field-layout";

export const DynamicConfigNumberField: FC<{
  classes: FieldLayoutClasses;
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  hint?: string;
  label: string;
  property: JsonSchemaProperty;
}> = ({ classes, disabled, dynamicForm, fieldName, hint, label, property }) => (
  <FormField
    control={dynamicForm.control}
    name={fieldName}
    render={({ field, fieldState }) => (
      <FormItem className={classes.item}>
        <FormLabel className={classes.label}>{label}</FormLabel>
        <FormControl>
          <Input
            name={field.name}
            value={
              resolveFieldValue(field.value, property.default) == null
                ? ""
                : String(resolveFieldValue(field.value, property.default))
            }
            onBlur={field.onBlur}
            onChange={(event) => {
              const nextValue = event.target.value;
              field.onChange(nextValue === "" ? "" : Number(nextValue));
            }}
            ref={field.ref}
            type="number"
            step={property.type === "integer" ? 1 : "any"}
            min={property.minimum}
            max={property.maximum}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            placeholder={label}
            className={classes.input}
          />
        </FormControl>
        {hint ? (
          <FormDescription className={classes.hint}>{hint}</FormDescription>
        ) : null}
        <FormMessage />
      </FormItem>
    )}
  />
);
