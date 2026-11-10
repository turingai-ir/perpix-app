import { useEffect, useRef } from "react";

import type { DynamicConfigForm } from "../../dynamic-config";
import type { GenerationComposerIntent } from "../model/conversation";
import type { useModel } from "./model";
import { withInferredMode } from "../model/retry-config";

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
  const switchedIntentRef = useRef<string | undefined>(undefined);
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
      const models = model.modelsListState.data;
      if (!models) return;
      const isAvailable = models.some(({ uuid }) => uuid === intent.modelUuid);
      // Switch at most once; an unavailable model would otherwise be
      // re-selected on every render and lock the model picker.
      if (isAvailable && switchedIntentRef.current !== intent.id) {
        switchedIntentRef.current = intent.id;
        model.setCurrentModel(intent.modelUuid);
        return;
      }
    }
    if (
      model.currentModel &&
      model.modelState.data?.uuid !== model.currentModel
    )
      return;
    if (requiredFieldMissing || limitExceeded) return;

    const config = intent.replace
      ? withInferredMode(intent.config, dynamicForm.configSchema)
      : intent.config;
    const entries = Object.entries(config)
      .filter(([fieldName]) => dynamicForm.properties[fieldName])
      // Mode first, so the fields it reveals accept their values.
      .sort(([left]) => (left === "mode" ? -1 : 0));
    if (!entries.length) return;
    if (intent.replace) {
      // A restored request replaces the draft: inputs it did not use (e.g.
      // references in a text-only request) must not leak into it.
      const provided = new Set(entries.map(([fieldName]) => fieldName));
      for (const [fieldName, property] of Object.entries(
        dynamicForm.properties,
      )) {
        if (provided.has(fieldName)) continue;
        const isArray = [property.type].flat().includes("array");
        const emptyValue = isArray ? [] : undefined;
        dynamicForm.setValue(fieldName, property.default ?? emptyValue, {
          shouldDirty: true,
        });
      }
    }
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
