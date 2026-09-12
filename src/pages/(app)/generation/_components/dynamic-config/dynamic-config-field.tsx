import type { FC } from "react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

import { DynamicConfigPropertyField } from "./fields/property-field";
import type { DynamicConfigForm, FieldLayout } from "./types";

export const DynamicPromptConfigField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  layout?: FieldLayout;
  simple?: boolean;
}> = ({ disabled, dynamicForm, fieldName, layout = "inline", simple }) => {
  const { t } = useAppTranslate();
  const meta = dynamicForm.getFieldMeta(fieldName);

  if (!meta) return null;

  const optionLabels = meta.options?.length
    ? Object.fromEntries(
        meta.options
          .filter((option) => option !== null)
          .map((option) => {
            const optionValue = String(option);

            return [
              optionValue,
              t(
                `common.dynamicConfig.optionLabels.${fieldName}.${optionValue}`,
                {
                  ns: APP_I18_KEYS.RESOURCES.MAIN,
                  defaultValue: meta.optionLabels?.[optionValue] ?? optionValue,
                },
              ),
            ];
          }),
      )
    : meta.optionLabels;

  return (
    <DynamicConfigPropertyField
      dynamicForm={dynamicForm}
      fieldName={fieldName}
      inputType={meta.inputType}
      hint={
        simple
          ? t(`pages.generation.image.studio.hints.${fieldName}`, {
              defaultValue: meta.hint ?? "",
            })
          : meta.hint
      }
      label={t(
        `${simple ? "pages.generation.image.studio.fields" : "common.dynamicConfig.fields"}.${fieldName}`,
        {
          ns: APP_I18_KEYS.RESOURCES.MAIN,
          defaultValue: t(`common.dynamicConfig.fields.${fieldName}`, {
            defaultValue: meta.title ?? fieldName,
          }),
        },
      )}
      optionLabels={optionLabels}
      options={meta.options}
      property={meta.property}
      disabled={disabled}
      layout={layout}
    />
  );
};
