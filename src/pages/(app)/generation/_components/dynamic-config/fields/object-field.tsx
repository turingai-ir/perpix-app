import type { FC, ReactNode } from "react";

import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";
import { cn } from "@/lib/utils";

import { resolvePropertyInputType } from "../schema";
import type { DynamicConfigFieldProps } from "../types";

export type RenderDynamicConfigField = (props: {
  fieldName: string;
  property: JsonSchemaProperty;
}) => ReactNode;

export const DynamicConfigObjectField: FC<
  DynamicConfigFieldProps & {
    renderField: RenderDynamicConfigField;
  }
> = ({ disabled, dynamicForm, fieldName, label, property, renderField }) => (
  <div className="border-input flex w-full flex-col gap-3 rounded-lg border p-3">
    <span className="text-muted-foreground text-sm font-normal">{label}</span>
    <DynamicConfigObjectFields
      dynamicForm={dynamicForm}
      fieldName={fieldName}
      property={property}
      disabled={disabled}
      renderField={renderField}
    />
  </div>
);

export const DynamicConfigObjectFields: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigFieldProps["dynamicForm"];
  fieldName: string;
  property: JsonSchemaProperty;
  renderField: RenderDynamicConfigField;
}> = ({ fieldName, property, renderField }) => (
  <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
    {Object.entries(property.properties ?? {}).map(
      ([childName, childProperty]) => {
        const childFieldName = `${fieldName}.${childName}`;

        return (
          <div
            key={childFieldName}
            className={cn(
              "min-w-0",
              ["array", "object"].includes(
                resolvePropertyInputType(childProperty),
              ) && "md:col-span-2",
            )}
          >
            {renderField({
              fieldName: childFieldName,
              property: childProperty,
            })}
          </div>
        );
      },
    )}
  </div>
);
