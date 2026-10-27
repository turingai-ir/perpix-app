import { SlidersHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

import { VideoDurationControl } from "./video-duration-control";
import { VideoFormatControl } from "./video-format-control";
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
  const durationMeta = dynamicForm.getFieldMeta("duration");
  const showDuration =
    durationMeta &&
    durationMeta.inputType !== "hidden" &&
    dynamicForm.isFieldVisible("duration");
  const quickFields = studio.promptBoxConfigFieldNames.filter(
    (name) => name !== "duration",
  );
  if (showDuration) quickFields.unshift("duration");
  const advanced = studio.advancedFieldNames.filter((name) => {
    const type = dynamicForm.getFieldMeta(name)?.inputType;
    return name !== "duration" && type !== "file" && type !== "file-list";
  });
  const advancedRef = useRef<HTMLDetailsElement>(null);
  const hasHiddenError = advanced.some(
    (name) =>
      dynamicForm.form.getFieldState(name, dynamicForm.form.formState).invalid,
  );
  useEffect(() => {
    if (hasHiddenError && advancedRef.current) advancedRef.current.open = true;
  }, [hasHiddenError, dynamicForm.form.formState.submitCount]);
  const renderField = (fieldName: string) => {
    if (fieldName === "duration") {
      return (
        <VideoDurationControl
          key={fieldName}
          dynamicForm={dynamicForm}
          disabled={isFormBusy}
        />
      );
    }
    if (fieldName === "aspect_ratio" || fieldName === "resolution") {
      return (
        <VideoFormatControl
          key={fieldName}
          dynamicForm={dynamicForm}
          fieldName={fieldName}
          disabled={isFormBusy}
        />
      );
    }
    return (
      <DynamicPromptConfigField
        key={fieldName}
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        disabled={isFormBusy}
        layout="stacked"
      />
    );
  };
  return (
    <div className={styles.settings}>
      <div className={styles.configGrid}>
        {quickFields
          .filter((name) => name !== "mode")
          .sort(
            (first, second) =>
              QUICK_FIELD_ORDER.indexOf(first) -
              QUICK_FIELD_ORDER.indexOf(second),
          )
          .map(renderField)}
      </div>
      {advanced.length > 0 && (
        <details ref={advancedRef} className={styles.advanced}>
          <summary>
            <SlidersHorizontal size={16} aria-hidden="true" />
            {t("pages.generation.video.studio.advanced")}
          </summary>
          <div className={styles.advancedBody}>{advanced.map(renderField)}</div>
        </details>
      )}
    </div>
  );
}
