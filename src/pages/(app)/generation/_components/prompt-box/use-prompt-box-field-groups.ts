import { useMemo } from "react";

import type { DynamicConfigForm } from "../dynamic-config";

const MODE_FIELD_NAME = "mode";
const FULL_WIDTH_INPUT_TYPES = new Set(["array", "object"]);

function isFullWidthPromptField(
  dynamicForm: DynamicConfigForm,
  fieldName: string,
) {
  const meta = dynamicForm.getFieldMeta(fieldName);

  return Boolean(meta && FULL_WIDTH_INPUT_TYPES.has(meta.inputType));
}

function isModeFieldVisible(dynamicForm: DynamicConfigForm) {
  return (
    Boolean(dynamicForm.properties[MODE_FIELD_NAME]) &&
    dynamicForm.isFieldVisible(MODE_FIELD_NAME)
  );
}

export function usePromptBoxFieldGroups({
  dynamicForm,
  fieldNames,
}: {
  dynamicForm: DynamicConfigForm;
  fieldNames: readonly string[];
}) {
  return useMemo(() => {
    const contentFieldNames = fieldNames.filter(
      (fieldName) => fieldName !== MODE_FIELD_NAME,
    );

    return {
      fullWidthFieldNames: contentFieldNames.filter((fieldName) =>
        isFullWidthPromptField(dynamicForm, fieldName),
      ),
      hasModeField: isModeFieldVisible(dynamicForm),
      inlineFieldNames: contentFieldNames.filter(
        (fieldName) => !isFullWidthPromptField(dynamicForm, fieldName),
      ),
    };
  }, [dynamicForm, fieldNames]);
}
