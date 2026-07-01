import type { FC } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";
import { cn } from "@/lib/utils";

import { resolveFieldValue } from "../../schema";
import type { DynamicConfigForm } from "../../types";

export const DynamicConfigCheckboxField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  isStacked: boolean;
  label: string;
  property: JsonSchemaProperty;
}> = ({ disabled, dynamicForm, fieldName, isStacked, label, property }) => (
  <FormField
    control={dynamicForm.control}
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
            checked={Boolean(resolveFieldValue(field.value, property.default))}
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
