import { useEffect, useRef } from "react";

import type { DynamicConfigForm } from "../_components/dynamic-config";
import type { GenerationComposerIntent } from "../_types/conversation";
import type { useModel } from "./model";

const strings = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

export function useGenerationComposerIntent({
  dynamicForm,
  intent,
  model,
  onApplied,
}: {
  dynamicForm: DynamicConfigForm;
  intent?: GenerationComposerIntent;
  model: ReturnType<typeof useModel>;
  onApplied?: (intentId: string) => void;
}) {
  const appliedIntentRef = useRef<string | undefined>(undefined);
  const requestedReferences = strings(intent?.config.reference_images);
  const currentReferences = strings(dynamicForm.watch("reference_images"));
  const referenceLimit = dynamicForm.properties.reference_images?.maxItems;
  const limitExceeded = Boolean(
    intent?.mergeReferences &&
    typeof referenceLimit === "number" &&
    new Set([...currentReferences, ...requestedReferences]).size >
      referenceLimit,
  );
  const requiredFieldMissing = Boolean(
    intent &&
    (!intent.modelUuid || intent.modelUuid === model.currentModel) &&
    dynamicForm.isReady &&
    intent.requiredFields?.some(
      (fieldName) => !dynamicForm.properties[fieldName],
    ),
  );

  useEffect(() => {
    if (
      !intent ||
      appliedIntentRef.current === intent.id ||
      !dynamicForm.isReady
    )
      return;
    if (intent.modelUuid && intent.modelUuid !== model.currentModel) {
      model.setCurrentModel(intent.modelUuid);
      return;
    }
    if (
      model.currentModel &&
      model.modelState.data?.uuid !== model.currentModel
    )
      return;
    if (requiredFieldMissing || limitExceeded) return;

    const entries = Object.entries(intent.config).filter(
      ([fieldName]) => dynamicForm.properties[fieldName],
    );
    if (!entries.length) return;
    for (const [fieldName, nextValue] of entries) {
      const value =
        intent.mergeReferences && fieldName === "reference_images"
          ? [
              ...new Set([
                ...strings(dynamicForm.getValues(fieldName)),
                ...requestedReferences,
              ]),
            ]
          : nextValue;
      dynamicForm.setValue(fieldName, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    appliedIntentRef.current = intent.id;
    onApplied?.(intent.id);
    requestAnimationFrame(() => dynamicForm.form.setFocus("prompt"));
  }, [
    dynamicForm,
    intent,
    limitExceeded,
    model,
    onApplied,
    requestedReferences,
    requiredFieldMissing,
  ]);

  return { isBlocked: requiredFieldMissing || limitExceeded };
}
