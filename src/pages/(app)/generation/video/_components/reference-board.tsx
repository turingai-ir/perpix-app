import { useCallback, useEffect, useState } from "react";

import styles from "../composer.module.css";
import { normalizeMediaIds } from "@/feature/media-uploader";
import { useAppTranslate } from "@/hooks";
import { DynamicConfigFileField } from "@/pages/(app)/generation/_components/dynamic-config";
import { isListFileField } from "@/pages/(app)/generation/_components/dynamic-config/file-upload/media";
import type { useGenerationPromptBox } from "@/pages/(app)/generation/_hooks";
import { formatLocalizedNumber } from "@/utils";

export function VideoReferenceBoard({
  studio,
}: {
  studio: ReturnType<typeof useGenerationPromptBox>;
}) {
  const { t } = useAppTranslate();
  const { dynamicForm, setIsUploadingMedia } = studio;
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const fields = dynamicForm.orderedFieldNames.filter((name) => {
    const type = dynamicForm.getFieldMeta(name)?.inputType;
    return (
      dynamicForm.isFieldVisible(name) &&
      (type === "file" || type === "file-list")
    );
  });
  const reportUpload = useCallback((name: string, uploading: boolean) => {
    setUploads((current) =>
      current[name] === uploading ? current : { ...current, [name]: uploading },
    );
  }, []);
  const uploading = fields.some((name) => uploads[name]);
  useEffect(() => {
    setIsUploadingMedia(uploading);
  }, [uploading, setIsUploadingMedia]);
  useEffect(() => () => setIsUploadingMedia(false), [setIsUploadingMedia]);
  if (!fields.length) return null;
  return (
    <section
      className={styles.references}
      aria-label={t("pages.generation.video.studio.references")}
    >
      {fields.map((name) => {
        const meta = dynamicForm.getFieldMeta(name);
        if (!meta) return null;
        const label = t(`common.dynamicConfig.fields.${name}`, {
          defaultValue: meta.title ?? name,
        });
        const max = isListFileField(meta.property) ? meta.property.maxItems : 1;
        const count = formatLocalizedNumber({
          value: normalizeMediaIds(dynamicForm.watch(name)).length,
        });
        const error = dynamicForm.form.getFieldState(
          name,
          dynamicForm.form.formState,
        ).error;
        return (
          <div className={styles.referenceGroup} key={name}>
            <h3 className={styles.referenceTitle}>{label}</h3>
            <div className={styles.referenceMeta}>
              <span>
                {t(
                  `pages.generation.video.studio.${meta.required ? "required" : "optional"}`,
                )}
              </span>
              <span aria-live="polite">
                {max === undefined
                  ? t("pages.generation.video.studio.referenceCount", {
                      current: count,
                    })
                  : t("pages.generation.video.studio.referenceCapacity", {
                      current: count,
                      max: formatLocalizedNumber({ value: max }),
                    })}
              </span>
            </div>
            <DynamicConfigFileField
              dynamicForm={dynamicForm}
              fieldName={name}
              property={meta.property}
              label={label}
              presentation="composer"
              hint={meta.hint}
              disabled={studio.isFormBusy}
              requestId={`video_${studio.model.currentModel}`}
              onUploadingChange={(value) => reportUpload(name, value)}
            />
            {error?.message && (
              <p role="alert" className={styles.fieldError}>
                {String(error.message)}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
