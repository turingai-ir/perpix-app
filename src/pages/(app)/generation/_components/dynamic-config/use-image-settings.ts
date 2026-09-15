import { useFormState, useWatch } from "react-hook-form";
import type { DynamicConfigForm } from "./types";

const EVERYDAY_FIELDS = new Set([
  "n",
  "size",
  "quality",
  "rendering_speed",
  "negative_prompt",
  "enhance_prompt",
  "raw",
]);

export function useImageSettings(
  dynamicForm: DynamicConfigForm,
  fieldNames: readonly string[],
) {
  const { form, control } = dynamicForm;
  const values = useWatch({ control });
  const { errors } = useFormState({ control });
  const visible = fieldNames.filter((name) => {
    const meta = dynamicForm.getFieldMeta(name);
    return (
      dynamicForm.isFieldVisible(name) &&
      meta &&
      !["hidden", "unknown"].includes(meta.inputType)
    );
  });
  const basic = visible.filter((name) => EVERYDAY_FIELDS.has(name));
  const professional = visible.filter((name) => !EVERYDAY_FIELDS.has(name));
  const getDefault = (name: string) => {
    const meta = dynamicForm.getFieldMeta(name);
    const value = dynamicForm.defaultValues[name];
    if (
      meta?.options?.length &&
      !meta.options.some((option) => Object.is(option, value))
    ) {
      return meta.property.default ?? meta.options[0];
    }
    return value;
  };
  const changed = visible.filter((name) => {
    let value = values[name];
    const defaultValue = getDefault(name);
    if (
      dynamicForm.getFieldMeta(name)?.inputType === "number" &&
      value !== "" &&
      value != null
    ) {
      value = Number(value);
    }
    return JSON.stringify(value) !== JSON.stringify(defaultValue);
  });
  const reset = () => {
    // Reset only this panel, never the prompt, reference media or primary controls.
    for (const name of visible) {
      form.setValue(name, getDefault(name), {
        shouldDirty: true,
        shouldTouch: false,
      });
    }
    form.clearErrors(visible);
  };

  return { basic, professional, visible, changed, reset, errors };
}
