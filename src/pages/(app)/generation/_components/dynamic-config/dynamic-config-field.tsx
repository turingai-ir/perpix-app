import type { FC } from "react";

import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";

import { DynamicConfigPropertyField } from "./fields/property-field";
import type { DynamicConfigForm, FieldLayout } from "./types";

export const DynamicPromptConfigField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  layout?: FieldLayout;
}> = ({ disabled, dynamicForm, fieldName, layout = "inline" }) => {
  const { t } = useAppTranslate();
  const meta = dynamicForm.getFieldMeta(fieldName);

  if (!meta) return null;

  return (
    <DynamicConfigPropertyField
      dynamicForm={dynamicForm}
      fieldName={fieldName}
      inputType={meta.inputType}
      label={t(`common.dynamicConfig.fields.${fieldName}`, {
        ns: APP_I18_KEYS.RESOURCES.MAIN,
        defaultValue: meta.title ?? fieldName,
      })}
      optionLabels={meta.optionLabels}
      options={meta.options}
      property={meta.property}
      disabled={disabled}
      layout={layout}
    />
  );
};
