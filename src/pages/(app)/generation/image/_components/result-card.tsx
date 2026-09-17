import { useState } from "react";
import { ImagePlus, PencilLine, RotateCcw } from "lucide-react";

import { MediaPreviewItem } from "@/components/custom/media-preview-item";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import type { SchemaAiTaskMessageResponse } from "@/services/api";
import { RegenerateImageDialog } from "./regenerate-dialog";
import styles from "./result-card.module.css";

function parseAspectRatio(value: unknown) {
  const match = String(value ?? "").match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  const width = Number(match?.[1]);
  const height = Number(match?.[2]);
  return width > 0 && height > 0
    ? { css: `${width} / ${height}`, value: width / height }
    : { css: "1 / 1", value: 1 };
}

export function ImageResultCard({
  images,
  message,
  requestMessage,
  onUseAsReference,
  onEditRequest,
  onRegenerate,
  disabled,
}: {
  images: string[];
  message: SchemaAiTaskMessageResponse;
  requestMessage?: SchemaAiTaskMessageResponse;
  onUseAsReference?: (fileId: string) => void;
  onEditRequest?: (message: SchemaAiTaskMessageResponse) => void;
  onRegenerate?: (message: SchemaAiTaskMessageResponse) => void;
  disabled?: boolean;
}) {
  const { t } = useAppTranslate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const source = requestMessage ?? message;
  const ratio = String(source.ai_model_config?.aspect_ratio ?? "1:1");
  const parsedRatio = parseAspectRatio(ratio);
  const resolution = source.ai_model_config?.resolution;
  return (
    <article className={`${styles.reveal} ${styles.stage}`}>
      <header className={styles.header}>
        <span className={styles.title}>
          <span className={styles.titleIcon}>
            <img
              src="/android-chrome-512x512.png"
              alt=""
              className={styles.avatar}
              aria-hidden="true"
            />
          </span>
          <span>{t("pages.generation.image.chat.result")}</span>
        </span>
        <span className={styles.metadata}>
          <bdi dir="ltr">{ratio}</bdi>
          {resolution ? (
            <>
              <span aria-hidden="true">•</span>
              <bdi dir="ltr">{String(resolution)}</bdi>
            </>
          ) : null}
        </span>
      </header>
      <div
        className={images.length > 1 ? styles.gallery : styles.singleGallery}
      >
        {images.map((fileId, index) => (
          <div
            key={fileId}
            className={styles.artwork}
            style={
              images.length === 1
                ? {
                    maxWidth: `min(100%, calc(58dvh * ${parsedRatio.value}))`,
                  }
                : undefined
            }
          >
            <MediaPreviewItem
              fileId={fileId}
              index={index}
              type="image"
              aspectRatio={parsedRatio.css}
              alt={source.message ?? t("common.image")}
            />
            {onUseAsReference && images.length > 1 ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={disabled}
                className={styles.imageAction}
                onClick={() => onUseAsReference(fileId)}
              >
                <ImagePlus aria-hidden="true" />
                {t("pages.generation.image.chat.useAsReference")}
              </Button>
            ) : null}
          </div>
        ))}
      </div>
      <footer className={styles.toolbar}>
        {onUseAsReference && images[0] && images.length === 1 ? (
          <Button
            type="button"
            variant="secondary"
            disabled={disabled}
            className={styles.primaryAction}
            onClick={() => onUseAsReference(images[0])}
          >
            <ImagePlus aria-hidden="true" />
            {t("pages.generation.image.chat.useAsReference")}
          </Button>
        ) : null}
        {onEditRequest && (
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className={styles.secondaryAction}
            onClick={() => onEditRequest(source)}
          >
            <PencilLine aria-hidden="true" />
            {t("pages.generation.image.chat.editRequest")}
          </Button>
        )}
        {onRegenerate && (
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className={styles.secondaryAction}
            onClick={() => setConfirmOpen(true)}
          >
            <RotateCcw aria-hidden="true" />
            {t("pages.generation.image.chat.regenerate")}
          </Button>
        )}
      </footer>
      <RegenerateImageDialog
        open={confirmOpen}
        disabled={disabled}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          onRegenerate?.(source);
        }}
      />
    </article>
  );
}
