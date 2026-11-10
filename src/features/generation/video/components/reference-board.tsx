import { Paperclip } from "lucide-react";

import { useVideoReferenceUploads } from "../hooks/use-video-reference-uploads";

import { normalizeMediaIds } from "@/features/media-uploader";
import { useAppTranslate } from "@/shared/hooks";
import {
  clearTopLevelMediaConflicts,
  DynamicConfigFileField,
  getAcceptList,
  getPreviewType,
  isListFileField,
} from "@/features/dynamic-config";
import type { useGenerationPromptBox } from "@/features/generation/hooks";
import { formatLocalizedNumber } from "@/shared/utils";

const REFERENCE_GROUP_CLASS =
  "group/ref relative grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-3 overflow-hidden rounded-[20px] border border-border bg-card bg-[radial-gradient(circle_at_86%_0%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_40%)] p-3.5 shadow-[inset_0_1px_rgb(255_255_255/10%),0_16px_36px_rgb(0_0_0/18%)] backdrop-blur-xl backdrop-saturate-140 not-supports-[backdrop-filter:blur(1px)]:bg-card";

const REFERENCE_FILES_CLASS = [
  "col-span-full min-w-0 [&_[data-media-upload-presentation=video-dock]]:w-full",
  "[&_[data-media-upload-trigger]]:relative [&_[data-media-upload-trigger]]:min-h-22 [&_[data-media-upload-trigger]]:overflow-hidden [&_[data-media-upload-trigger]]:border-border [&_[data-media-upload-trigger]]:bg-background/60 [&_[data-media-upload-trigger]]:text-primary [&_[data-media-upload-trigger]]:shadow-[inset_0_1px_rgb(255_255_255/8%)] [&_[data-media-upload-trigger]]:transition-[scale,border-color,background-color] [&_[data-media-upload-trigger]]:duration-150 [&_[data-media-upload-trigger]]:ease-out-quint",
  "hover-capable:[&_[data-media-upload-trigger]:hover]:border-primary/55 hover-capable:[&_[data-media-upload-trigger]:hover]:bg-accent [&_[data-media-upload-trigger]:active]:scale-[0.96] [&_[data-media-upload-trigger]:focus-visible]:outline-2 [&_[data-media-upload-trigger]:focus-visible]:outline-offset-3 [&_[data-media-upload-trigger]:focus-visible]:outline-ring",
  "[&_[data-media-upload-trigger]>div]:bg-primary/14 [&_[data-media-upload-trigger]>div]:shadow-[inset_0_1px_rgb(255_255_255/10%)] [&_[data-media-upload-trigger]>span]:text-foreground",
  "[&_[data-media-dock]]:gap-3 [&_[data-media-dock]]:border-0 [&_[data-media-dock]]:pt-0 [&_[data-media-dock]>div:first-child]:px-0.5 [&_[data-media-dock]>div:first-child]:pt-0.75 [&_[data-media-dock]_button]:min-h-11",
  "[&_[data-media-preview-list]]:max-w-full [&_[data-media-preview-list]]:flex-wrap [&_[data-media-preview-list]]:gap-2.5",
  "[&_[data-media-preview]]:size-26 [&_[data-media-preview]]:border-border [&_[data-media-preview]]:bg-background/60 [&_[data-media-preview]]:shadow-[0_10px_24px_rgb(0_0_0/24%)] [&_[data-media-preview]]:outline-1 [&_[data-media-preview]]:-outline-offset-1 [&_[data-media-preview]]:outline-foreground/8",
  "[&_[data-media-preview][data-media-type=audio]]:aspect-[2/1] [&_[data-media-preview][data-media-type=audio]]:h-auto [&_[data-media-preview][data-media-type=audio]]:w-[min(100%,230px)]",
  "motion-reduce:[&_[data-media-upload-trigger]]:transition-none",
].join(" ");

export function VideoReferenceBoard({
  studio,
}: {
  studio: ReturnType<typeof useGenerationPromptBox>;
}) {
  const { t } = useAppTranslate();
  const { dynamicForm } = studio;
  const { fields, reportUpload } = useVideoReferenceUploads(studio);
  if (!fields.length) return null;
  return (
    <section
      className="grid gap-3"
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
            className={REFERENCE_GROUP_CLASS}
            key={name}
            data-required={meta.required || undefined}
            data-media-type={previewType}
          >
            <h3 className="[&_svg]:text-muted-foreground col-start-1 flex items-center gap-1.5 text-xs font-semibold [&_svg]:flex-none">
              <Paperclip size={16} aria-hidden="true" />
              {label}
            </h3>
            <div className="text-muted-foreground group-data-[required=true]/ref:[&>span:first-child]:text-primary col-start-2 flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-xs tabular-nums">
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
            <div className={REFERENCE_FILES_CLASS}>
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
            {meta.hint && (
              <p className="text-muted-foreground col-span-full text-xs leading-relaxed">
                {meta.hint}
              </p>
            )}
            {error?.message && (
              <p
                role="alert"
                className="text-destructive col-span-full text-xs leading-relaxed"
              >
                {String(error.message)}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
