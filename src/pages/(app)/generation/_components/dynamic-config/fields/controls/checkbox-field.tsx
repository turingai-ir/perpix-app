import type { FC } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";
import { cn } from "@/lib/utils";

import { resolveFieldValue } from "../../schema";
import type { DynamicConfigForm } from "../../types";

const HINT_CLASS_NAME = "text-muted-foreground/60 text-[0.7rem] leading-snug";

export const DynamicConfigCheckboxField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  hint?: string;
  isStacked: boolean;
  label: string;
  property: JsonSchemaProperty;
}> = ({
  disabled,
  dynamicForm,
  fieldName,
  hint,
  isStacked,
  label,
  property,
}) => (
  <FormField
    control={dynamicForm.control}
    name={fieldName}
    render={({ field }) => (
      <FormItem className={isStacked ? "w-full" : "w-full md:w-auto"}>
        <div
          className={cn(
            "border-input flex min-h-8 items-center gap-2 rounded-lg border px-2.5",
            "w-full",
          )}
        >
          <FormControl>
            <Checkbox
              name={field.name}
              checked={Boolean(
                resolveFieldValue(field.value, property.default),
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
        </div>
        {hint ? (
          <FormDescription className={HINT_CLASS_NAME}>{hint}</FormDescription>
        ) : null}
      </FormItem>
    )}
  />
);
