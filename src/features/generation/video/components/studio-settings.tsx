import { SlidersHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

import { VideoDurationControl } from "./video-duration-control";
import { VideoFormatControl } from "./video-format-control";
import { useAppTranslate } from "@/shared/hooks";
import { DynamicPromptConfigField } from "@/features/dynamic-config";
import type { useGenerationPromptBox } from "@/features/generation/hooks";

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
    <div className="grid gap-2">
      <div className="*:border-border *:bg-muted grid grid-cols-2 gap-2 *:min-w-0 *:rounded-xl *:border *:p-3 [&_button]:min-h-11 [&_button]:w-full [&_button]:text-[13px]">
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
        <details ref={advancedRef} className="group/adv border-border border-t">
          <summary className="text-muted-foreground focus-visible:outline-ring flex min-h-11 cursor-pointer list-none items-center gap-2 text-xs after:ms-auto after:text-xl after:content-['+'] group-open/adv:after:content-['−'] focus-visible:outline-2 focus-visible:outline-offset-3 [&::-webkit-details-marker]:hidden">
            <SlidersHorizontal size={16} aria-hidden="true" />
            {t("pages.generation.video.studio.advanced")}
          </summary>
          <div className="grid gap-2 py-2">{advanced.map(renderField)}</div>
        </details>
      )}
    </div>
  );
}
