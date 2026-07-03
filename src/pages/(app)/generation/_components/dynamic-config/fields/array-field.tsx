import type { FC, ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";

import {
  getDefaultValueForProperty,
  getPrimaryType,
  normalizeArrayValue,
} from "../schema";
import type { DynamicConfigFieldProps } from "../types";

const HINT_CLASS_NAME = "text-muted-foreground/60 text-[0.7rem] leading-snug";

export const DynamicConfigArrayField: FC<
  DynamicConfigFieldProps & {
    renderObjectFields: (props: {
      fieldName: string;
      property: JsonSchemaProperty;
    }) => ReactNode;
  }
> = ({
  disabled,
  dynamicForm,
  fieldName,
  hint,
  label,
  property,
  renderObjectFields,
}) => {
  const itemsProperty = property.items;
  const value = normalizeArrayValue(dynamicForm.watch(fieldName));
  const hasReachedMax =
    property.maxItems !== undefined && value.length >= property.maxItems;

  if (!itemsProperty) return null;

  if (getPrimaryType(itemsProperty) === "object") {
    return (
      <ObjectArrayField
        disabled={disabled}
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        hasReachedMax={hasReachedMax}
        hint={hint}
        itemsProperty={itemsProperty}
        label={label}
        renderObjectFields={renderObjectFields}
        value={value}
      />
    );
  }

  if (itemsProperty.enum?.length) {
    return (
      <EnumArrayField
        disabled={disabled}
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        itemsProperty={itemsProperty}
        hint={hint}
        label={label}
        value={value}
      />
    );
  }

  return (
    <TextArrayField
      disabled={disabled}
      dynamicForm={dynamicForm}
      fieldName={fieldName}
      hint={hint}
      label={label}
    />
  );
};

const ObjectArrayField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigFieldProps["dynamicForm"];
  fieldName: string;
  hasReachedMax: boolean;
  hint?: string;
  itemsProperty: JsonSchemaProperty;
  label: string;
  renderObjectFields: (props: {
    fieldName: string;
    property: JsonSchemaProperty;
  }) => ReactNode;
  value: unknown[];
}> = ({
  disabled,
  dynamicForm,
  fieldName,
  hasReachedMax,
  hint,
  itemsProperty,
  label,
  renderObjectFields,
  value,
}) => {
  const handleAdd = () => {
    if (disabled || hasReachedMax) return;

    dynamicForm.setValue(
      fieldName,
      [
        ...value,
        getDefaultValueForProperty(itemsProperty, undefined, value.length),
      ],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleRemove = (index: number) => {
    if (disabled) return;

    dynamicForm.setValue(
      fieldName,
      value.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-sm font-normal">
          {label}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || hasReachedMax}
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4" />
          {label}
        </Button>
      </div>
      {hint ? <p className={HINT_CLASS_NAME}>{hint}</p> : null}
      {value.map((_, index) => (
        <div
          key={`${fieldName}-${index}`}
          className="border-input flex w-full flex-col gap-3 rounded-lg border p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">
              {label} {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              onClick={() => handleRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {renderObjectFields({
            fieldName: `${fieldName}.${index}`,
            property: itemsProperty,
          })}
        </div>
      ))}
    </div>
  );
};

const EnumArrayField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigFieldProps["dynamicForm"];
  fieldName: string;
  hint?: string;
  itemsProperty: JsonSchemaProperty;
  label: string;
  value: unknown[];
}> = ({
  disabled,
  dynamicForm,
  fieldName,
  hint,
  itemsProperty,
  label,
  value,
}) => {
  const selectedValues = new Set(value.map(String));

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-muted-foreground text-sm font-normal">{label}</span>
      {hint ? <p className={HINT_CLASS_NAME}>{hint}</p> : null}
      <div className="flex flex-wrap gap-2">
        {itemsProperty.enum
          ?.filter((option) => option !== null)
          .map((option) => (
            <label
              key={String(option)}
              className="border-input flex min-h-8 items-center gap-2 rounded-lg border px-2.5 text-sm"
            >
              <Checkbox
                checked={selectedValues.has(String(option))}
                disabled={disabled}
                onCheckedChange={(checked) => {
                  const nextValue = checked
                    ? [...value, option]
                    : value.filter((item) => !Object.is(item, option));

                  dynamicForm.setValue(fieldName, nextValue, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
              {String(option)}
            </label>
          ))}
      </div>
    </div>
  );
};

const TextArrayField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigFieldProps["dynamicForm"];
  fieldName: string;
  hint?: string;
  label: string;
}> = ({ disabled, dynamicForm, fieldName, hint, label }) => (
  <FormField
    control={dynamicForm.control}
    name={fieldName}
    render={({ field }) => (
      <FormItem className="flex w-full flex-col gap-2">
        <FormLabel className="text-muted-foreground text-sm font-normal">
          {label}
        </FormLabel>
        {hint ? <p className={HINT_CLASS_NAME}>{hint}</p> : null}
        <FormControl>
          <Textarea
            value={normalizeArrayValue(field.value).join("\n")}
            onChange={(event) =>
              field.onChange(
                event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
            disabled={disabled}
            placeholder={label}
          />
        </FormControl>
      </FormItem>
    )}
  />
);
