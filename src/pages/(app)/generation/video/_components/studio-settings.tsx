import { SlidersHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

import styles from "../composer.module.css";
import { useAppTranslate } from "@/hooks";
import { DynamicPromptConfigField } from "@/pages/(app)/generation/_components/dynamic-config";
import type { useGenerationPromptBox } from "@/pages/(app)/generation/_hooks";

const QUICK_FIELD_ORDER = ["duration", "aspect_ratio", "resolution"];

export function VideoStudioSettings({
  studio,
}: {
  studio: ReturnType<typeof useGenerationPromptBox>;
}) {
  const { t } = useAppTranslate();
  const { dynamicForm, isFormBusy } = studio;
  const advanced = studio.advancedFieldNames.filter((name) => {
    const type = dynamicForm.getFieldMeta(name)?.inputType;
    return type !== "file" && type !== "file-list";
  });
  const required = advanced.filter(
    (name) => dynamicForm.getFieldMeta(name)?.required,
  );
  const optional = advanced.filter(
    (name) => !dynamicForm.getFieldMeta(name)?.required,
  );
  const advancedRef = useRef<HTMLDetailsElement>(null);
  const hasHiddenError = optional.some(
    (name) =>
      dynamicForm.form.getFieldState(name, dynamicForm.form.formState).invalid,
  );
  useEffect(() => {
    if (hasHiddenError && advancedRef.current) advancedRef.current.open = true;
  }, [hasHiddenError, dynamicForm.form.formState.submitCount]);
  const renderField = (fieldName: string) => (
    <DynamicPromptConfigField
      key={fieldName}
      dynamicForm={dynamicForm}
      fieldName={fieldName}
      disabled={isFormBusy}
      layout="stacked"
    />
  );
  return (
    <div className={styles.settings}>
      <div className={styles.configGrid}>
        {studio.promptBoxConfigFieldNames
          .filter((name) => name !== "mode")
          .sort(
            (first, second) =>
              QUICK_FIELD_ORDER.indexOf(first) -
              QUICK_FIELD_ORDER.indexOf(second),
          )
          .map(renderField)}
        {required.map(renderField)}
      </div>
      {optional.length > 0 && (
        <details ref={advancedRef} className={styles.advanced}>
          <summary>
            <SlidersHorizontal size={16} aria-hidden="true" />
            {t("pages.generation.video.studio.advanced")}
          </summary>
          <div className={styles.advancedBody}>{optional.map(renderField)}</div>
        </details>
      )}
    </div>
  );
}
