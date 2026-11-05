import { Plus } from "lucide-react";
import type { FC } from "react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber } from "@/utils";
import { FileManagerUploadStatus } from "@/feature/file-manager";

import { LocalMediaPreviewItem, MediaPreviewItem } from "./media-strip-items";
import type { MediaUploadStripProps } from "../types";

type Props = Pick<
  MediaUploadStripProps,
  | "uploadedItems"
  | "localItems"
  | "disabled"
  | "previewType"
  | "presentation"
  | "label"
  | "maxItems"
  | "onDeleteClick"
  | "onLocalDeleteClick"
  | "onFileSelect"
> & {
  onAdd: () => void;
};

export const ComposerReferenceTray: FC<Props> = ({
  uploadedItems,
  localItems,
  disabled = false,
  previewType = "image",
  presentation = "composer",
  label,
  maxItems,
  onDeleteClick,
  onLocalDeleteClick,
  onFileSelect,
  onAdd,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const count =
    uploadedItems.length +
    localItems.filter(
      (item) => item.status === FileManagerUploadStatus.UPLOADING,
    ).length;
  const isFull = maxItems !== undefined && count >= maxItems;
  const isVideoDock = presentation === "video-dock";

  return (
    <div
      className="border-border/60 flex w-full min-w-0 flex-col gap-2 border-t pt-3"
      data-media-dock={isVideoDock || undefined}
      data-media-type={previewType}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium">
            {isVideoDock
              ? t(`features.mediaUploader.videoDock.selected.${previewType}`)
              : t("features.mediaUploader.composer.references")}
          </span>
          <span className="text-muted-foreground" aria-live="polite">
            {maxItems === undefined
              ? formatLocalizedNumber({ value: count })
              : t("features.mediaUploader.composer.count", {
                  count,
                  max: maxItems,
                })}
          </span>
        </div>
        <button
          type="button"
          className="text-primary hover:bg-primary/10 focus-visible:ring-primary/50 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-medium outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || isFull}
          onClick={onAdd}
        >
          <Plus aria-hidden="true" className="size-4" />
          {isFull
            ? t("features.mediaUploader.composer.full")
            : isVideoDock && label
              ? label
              : t("features.mediaUploader.composer.add")}
        </button>
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="list"
        aria-label={
          isVideoDock
            ? t(`features.mediaUploader.videoDock.selected.${previewType}`)
            : t("features.mediaUploader.composer.references")
        }
        data-media-preview-list={isVideoDock || undefined}
      >
        {localItems.map((item) => (
          <div role="listitem" key={item.id ?? item.file.name}>
            <LocalMediaPreviewItem
              item={item}
              disabled={disabled}
              previewType={previewType}
              presentation={presentation}
              onDeleteClick={onLocalDeleteClick}
              onRetry={onFileSelect}
            />
          </div>
        ))}
        {uploadedItems.map((item, index) => (
          <div role="listitem" key={item.id}>
            <MediaPreviewItem
              item={item}
              disabled={disabled}
              previewType={previewType}
              presentation={presentation}
              index={index + 1}
              onDeleteClick={onDeleteClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
