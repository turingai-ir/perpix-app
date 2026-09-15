import { useState } from "react";
import { ImagePlus, PencilLine, RotateCcw, Sparkles } from "lucide-react";

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
    <article
      className={`${styles.reveal} border-border bg-card/80 overflow-hidden rounded-2xl border p-3 shadow-xl`}
    >
      <header className="mb-3 flex items-center justify-between gap-3 px-1">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles aria-hidden="true" className="text-primary size-4" />
          {t("pages.generation.image.chat.result")}
        </span>
        <span className="text-muted-foreground flex items-center gap-2 text-xs">
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
        className={
          images.length > 1 ? "grid grid-cols-2 gap-2" : "flex flex-col"
        }
      >
        {images.map((fileId, index) => (
          <div
            key={fileId}
            className="group relative mx-auto w-full overflow-hidden rounded-xl"
            style={
              images.length === 1
                ? {
                    maxWidth: `min(100%, calc(65dvh * ${parsedRatio.value}))`,
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
            {onUseAsReference && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={disabled}
                className="absolute end-2 bottom-2 min-h-10 rounded-xl shadow-lg"
                onClick={() => onUseAsReference(fileId)}
              >
                <ImagePlus aria-hidden="true" />
                {t("pages.generation.image.chat.useAsReference")}
              </Button>
            )}
          </div>
        ))}
      </div>
      <footer className="mt-3 flex flex-wrap items-center gap-2">
        {onEditRequest && (
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className="min-h-11 rounded-xl"
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
            className="min-h-11 rounded-xl"
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
