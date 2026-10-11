import { useCallback, useEffect, useState } from "react";
import { Paperclip } from "lucide-react";

import styles from "../composer.module.css";
import { normalizeMediaIds } from "@/feature/media-uploader";
import { useAppTranslate } from "@/hooks";
import { DynamicConfigFileField } from "@/pages/(app)/generation/_components/dynamic-config";
import {
  clearTopLevelMediaConflicts,
  getAcceptList,
  getPreviewType,
  isListFileField,
} from "@/pages/(app)/generation/_components/dynamic-config/file-upload/media";
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
        const previewType = getPreviewType(getAcceptList(meta.property));
        const max = isListFileField(meta.property) ? meta.property.maxItems : 1;
        const count = formatLocalizedNumber({
          value: normalizeMediaIds(dynamicForm.watch(name)).length,
        });
        const error = dynamicForm.form.getFieldState(
          name,
          dynamicForm.form.formState,
        ).error;
        return (
          <div
            className={styles.referenceGroup}
            key={name}
            data-required={meta.required || undefined}
            data-media-type={previewType}
          >
            <h3 className={styles.referenceTitle}>
              <Paperclip size={16} aria-hidden="true" />
              {label}
            </h3>
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
            <div className={styles.referenceFiles}>
              <DynamicConfigFileField
                dynamicForm={dynamicForm}
                fieldName={name}
                property={meta.property}
                label={label}
                presentation="video-dock"
                disabled={studio.isFormBusy}
                requestId={`video_${studio.model.currentModel}`}
                onUploadingChange={(value) => reportUpload(name, value)}
                onValueChange={() =>
                  clearTopLevelMediaConflicts(dynamicForm, name)
                }
              />
            </div>
            {meta.hint && <p className={styles.referenceHint}>{meta.hint}</p>}
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
