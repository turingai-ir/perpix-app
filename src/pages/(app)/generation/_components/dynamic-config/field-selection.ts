import type { DynamicConfigForm } from "./types";

const HIDDEN_CONFIG_FIELD_NAMES = new Set(["seed", "n", "delivery_method"]);
const RENDERABLE_INPUT_TYPES = new Set([
  "array",
  "checkbox",
  "file",
  "file-list",
  "number",
  "object",
  "select",
  "text",
  "textarea",
]);

export function getPromptConfigFieldNames({
  dynamicForm,
  excludedFields,
  includedFields,
}: {
  dynamicForm: DynamicConfigForm;
  excludedFields?: ReadonlySet<string>;
  includedFields?: ReadonlySet<string>;
}) {
  return dynamicForm.orderedFieldNames.filter((fieldName) => {
    const widget = dynamicForm.configSchema["x-ui"]?.widgets?.[fieldName];
    const meta = dynamicForm.getFieldMeta(fieldName);

    if (!meta || meta.inputType === "unknown") return false;
    if (meta.inputType === "hidden") return false;
    if (HIDDEN_CONFIG_FIELD_NAMES.has(fieldName)) return false;
    if (excludedFields?.has(fieldName)) return false;
    if (includedFields && !includedFields.has(fieldName)) return false;
    if (widget === "hidden" || !dynamicForm.isFieldVisible(fieldName)) {
      return false;
    }

    return RENDERABLE_INPUT_TYPES.has(meta.inputType);
  });
}
