import { useState } from "react";
import {
  Check,
  Columns2,
  ImagePlus,
  PencilLine,
  RotateCcw,
} from "lucide-react";

import { MediaPreviewItem } from "@/features/generation/components/media-output/media-preview-item";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";
import type { SchemaAiTaskMessageResponse } from "@/shared/api";
import { RegenerateImageDialog } from "./regenerate-dialog";
import { ResultSpecRobot } from "./result-spec-robot";
import type { ImageComparisonItem } from "./image-comparison.types";
import { mergeRequestConfig } from "../../model/retry-config";

const ACTION_BASE_CLASS =
  "min-h-11 rounded-full transition-[color,background-color,transform] duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";
const OVERLAY_ACTION_CLASS = `${ACTION_BASE_CLASS} absolute end-2.5 shadow-[0_0.75rem_2rem_rgb(0_0_0/42%)]`;
const PRIMARY_ACTION_CLASS = `${ACTION_BASE_CLASS} border border-[color-mix(in_srgb,var(--primary)_72%,white_12%)] bg-linear-135 from-[color-mix(in_srgb,var(--primary)_88%,var(--violet-brand))] to-[color-mix(in_srgb,var(--primary)_58%,var(--background))] px-3.5 text-primary-foreground shadow-[inset_0_1px_rgb(255_255_255/18%),0_0.65rem_1.8rem_color-mix(in_srgb,var(--primary)_22%,transparent)] hover-capable:hover:brightness-110`;
const SECONDARY_ACTION_CLASS = `${ACTION_BASE_CLASS} px-3.5 text-muted-foreground hover-capable:hover:text-foreground`;

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
  imageIndexOffset = 0,
  message,
  requestMessage,
  onUseAsReference,
  onEditRequest,
  onRegenerate,
  comparedImageIds,
  comparisonLimitReached,
  onToggleComparison,
  disabled,
}: {
  images: string[];
  imageIndexOffset?: number;
  message: SchemaAiTaskMessageResponse;
  requestMessage?: SchemaAiTaskMessageResponse;
  onUseAsReference?: (fileId: string) => void;
  onEditRequest?: (message: SchemaAiTaskMessageResponse) => void;
  onRegenerate?: (message: SchemaAiTaskMessageResponse) => void;
  comparedImageIds?: ReadonlySet<string>;
  comparisonLimitReached?: boolean;
  onToggleComparison?: (item: ImageComparisonItem) => void;
  disabled?: boolean;
}) {
  const { t } = useAppTranslate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [missingIds, setMissingIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const source = requestMessage ?? message;
  // Inputs may be stored on the request, the reply or both.
  const requestConfig = mergeRequestConfig(
    message.ai_model_config,
    requestMessage?.ai_model_config,
  );
  const ratio = String(requestConfig.aspect_ratio ?? "1:1");
  const parsedRatio = parseAspectRatio(ratio);
  const resolution = requestConfig.resolution;
  const prompt = source.message ?? String(requestConfig.prompt ?? "");

  const getComparisonItem = (fileId: string): ImageComparisonItem => ({
    aspectRatio: ratio,
    fileId,
    prompt,
    resolution,
  });
  const updateMissing = (fileId: string, missing: boolean) => {
    setMissingIds((current) => {
      if (current.has(fileId) === missing) return current;
      const next = new Set(current);
      if (missing) next.add(fileId);
      else next.delete(fileId);
      return next;
    });
  };
  return (
    <article className="animate-message-arrival relative isolate mr-auto mb-0 ml-0 w-full max-w-3xl origin-[50%_20%] motion-reduce:animate-none">
      <header
        className="mb-3 flex min-h-13 w-full flex-wrap items-center justify-between gap-2.5"
        dir="rtl"
      >
        <span
          className="flex min-w-0 items-center gap-2.5 text-sm font-bold"
          dir="rtl"
        >
          <span className="aspect-square w-8 flex-none overflow-hidden rounded-[0.65rem] border border-[color-mix(in_srgb,var(--border)_75%,var(--primary)_25%)] bg-black">
            <img
              src="/android-chrome-512x512.png"
              alt=""
              className="size-full object-contain"
              aria-hidden="true"
            />
          </span>
          <span>{t("pages.generation.image.chat.result")}</span>
        </span>
        <ResultSpecRobot ratio={ratio} resolution={resolution} />
      </header>
      <div
        className={
          images.length > 1
            ? "grid grid-cols-2 gap-3 ps-10.5 max-sm:grid-cols-1 max-sm:ps-0"
            : "flex justify-start"
        }
        dir={images.length > 1 ? undefined : "ltr"}
      >
        {images.map((fileId, index) => (
          <div
            key={fileId}
            className="[&>div]:border-foreground/9 relative w-full overflow-hidden rounded-2xl shadow-[0_1rem_2.75rem_rgb(0_0_0/38%)] max-sm:max-w-full! max-sm:rounded-[0.85rem] [&>div]:rounded-2xl [&>div]:bg-black"
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
              index={imageIndexOffset + index}
              type="image"
              aspectRatio={parsedRatio.css}
              alt={prompt || t("common.image")}
              showRetentionInfo
              onMissingChange={(missing) => updateMissing(fileId, missing)}
              onMissingAction={
                images.length === 1 && onEditRequest
                  ? () => onEditRequest(source)
                  : undefined
              }
              missingActionLabel={t("pages.generation.image.chat.editRequest")}
            />
            {onToggleComparison && images.length > 1 ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                aria-pressed={comparedImageIds?.has(fileId) ?? false}
                disabled={
                  disabled ||
                  (missingIds.has(fileId) && !comparedImageIds?.has(fileId)) ||
                  (comparisonLimitReached && !comparedImageIds?.has(fileId))
                }
                className={cn(
                  OVERLAY_ACTION_CLASS,
                  "hover-capable:hover:bg-[rgb(20_18_28/90%)] supports-[not(backdrop-filter:blur(1px))]:bg-card top-2.5 border-white/12 bg-[rgb(9_9_14/78%)] backdrop-blur-[14px] backdrop-saturate-125",
                )}
                onClick={() => onToggleComparison(getComparisonItem(fileId))}
              >
                {comparedImageIds?.has(fileId) ? (
                  <Check aria-hidden="true" />
                ) : (
                  <Columns2 aria-hidden="true" />
                )}
                {t(
                  comparedImageIds?.has(fileId)
                    ? "pages.generation.image.compare.selected"
                    : "pages.generation.image.compare.add",
                )}
              </Button>
            ) : null}
            {onUseAsReference && images.length > 1 ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={disabled || missingIds.has(fileId)}
                className={cn(OVERLAY_ACTION_CLASS, "bottom-2.5")}
                onClick={() => onUseAsReference(fileId)}
              >
                <ImagePlus aria-hidden="true" />
                {t("pages.generation.image.chat.useAsReference")}
              </Button>
            ) : null}
          </div>
        ))}
      </div>
      <footer className="mt-2.5 mr-auto ml-0 flex flex-wrap items-center gap-1.5 max-sm:ms-0">
        {onUseAsReference && images[0] && images.length === 1 ? (
          <Button
            type="button"
            variant="default"
            disabled={disabled || missingIds.has(images[0])}
            className={PRIMARY_ACTION_CLASS}
            onClick={() => onUseAsReference(images[0])}
          >
            <ImagePlus aria-hidden="true" />
            {t("pages.generation.image.chat.useAsReference")}
          </Button>
        ) : null}
        {onToggleComparison && images[0] && images.length === 1 ? (
          <Button
            type="button"
            variant="secondary"
            aria-pressed={comparedImageIds?.has(images[0]) ?? false}
            disabled={
              disabled ||
              (missingIds.has(images[0]) &&
                !comparedImageIds?.has(images[0])) ||
              (comparisonLimitReached && !comparedImageIds?.has(images[0]))
            }
            className={SECONDARY_ACTION_CLASS}
            onClick={() => onToggleComparison(getComparisonItem(images[0]))}
          >
            {comparedImageIds?.has(images[0]) ? (
              <Check aria-hidden="true" />
            ) : (
              <Columns2 aria-hidden="true" />
            )}
            {t(
              comparedImageIds?.has(images[0])
                ? "pages.generation.image.compare.selected"
                : "pages.generation.image.compare.add",
            )}
          </Button>
        ) : null}
        {onEditRequest &&
          !(images.length === 1 && missingIds.has(images[0])) && (
            <Button
              type="button"
              variant="ghost"
              disabled={disabled}
              className={SECONDARY_ACTION_CLASS}
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
            className={SECONDARY_ACTION_CLASS}
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
