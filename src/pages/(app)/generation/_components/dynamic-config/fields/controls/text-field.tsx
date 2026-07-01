import type { FC } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { DynamicConfigForm } from "../../types";
import type { FieldLayoutClasses } from "./field-layout";

export const DynamicConfigTextField: FC<{
  classes: FieldLayoutClasses;
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  label: string;
}> = ({ classes, disabled, dynamicForm, fieldName, label }) => (
  <FormField
    control={dynamicForm.control}
    name={fieldName}
    render={({ field, fieldState }) => (
      <FormItem className={classes.item}>
        <FormLabel className={classes.label}>{label}</FormLabel>
        <FormControl>
          <Input
            name={field.name}
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onChange={field.onChange}
            ref={field.ref}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            placeholder={label}
            className={classes.control}
          />
        </FormControl>
      </FormItem>
    )}
  />
);
