import { Plus } from "lucide-react";
import type { FC } from "react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

import { LocalMediaPreviewItem, MediaPreviewItem } from "./media-strip-items";
import type { MediaUploadStripProps } from "../types";

type Props = Pick<
  MediaUploadStripProps,
  | "uploadedItems"
  | "localItems"
  | "disabled"
  | "previewType"
  | "maxItems"
  | "onDeleteClick"
  | "onLocalDeleteClick"
> & {
  onAdd: () => void;
};

export const ComposerReferenceTray: FC<Props> = ({
  uploadedItems,
  localItems,
  disabled = false,
  previewType = "image",
  maxItems = 5,
  onDeleteClick,
  onLocalDeleteClick,
  onAdd,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const count = uploadedItems.length + localItems.length;
  const isFull = count >= maxItems;

  return (
    <div className="border-border/60 flex w-full min-w-0 flex-col gap-2 border-t pt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium">
            {t("features.mediaUploader.composer.references")}
          </span>
          <span className="text-muted-foreground" aria-live="polite">
            {t("features.mediaUploader.composer.count", {
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
            : t("features.mediaUploader.composer.add")}
        </button>
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="list"
        aria-label={t("features.mediaUploader.composer.references")}
      >
        {localItems.map((item) => (
          <div role="listitem" key={item.file.name}>
            <LocalMediaPreviewItem
              item={item}
              disabled={disabled}
              previewType={previewType}
              presentation="composer"
              onDeleteClick={onLocalDeleteClick}
            />
          </div>
        ))}
        {uploadedItems.map((item, index) => (
          <div role="listitem" key={item.id}>
            <MediaPreviewItem
              item={item}
              disabled={disabled}
              previewType={previewType}
              presentation="composer"
              index={index + 1}
              onDeleteClick={onDeleteClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
