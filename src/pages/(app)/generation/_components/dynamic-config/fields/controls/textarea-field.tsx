import type { FC } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import type { DynamicConfigForm } from "../../types";
import type { FieldLayoutClasses } from "./field-layout";

export const DynamicConfigTextareaField: FC<{
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
          <Textarea
            name={field.name}
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onChange={field.onChange}
            ref={field.ref}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            placeholder={label}
            className="min-h-20"
          />
        </FormControl>
      </FormItem>
    )}
  />
);
