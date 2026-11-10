import type { FC } from "react";

import { GenerationChats } from "@/features/generation/components/chats";
import { useAppTranslate } from "@/shared/hooks";
import type { SchemaAiTaskMessageResponse } from "@/shared/api";
import type { OptimisticGenerationTurn } from "@/features/generation/model/conversation";
import { OptimisticImageTurn } from "./optimistic-turn";
import { ImageResultCard } from "./result-card";
import { APP_I18_KEYS } from "@/shared/i18n";
import { ImageGenerationPlaceholder } from "./image-generation-placeholder";
import { ImageRequestSummary } from "./request-summary";
import type { ImageComparisonItem } from "./image-comparison.types";

interface Props {
  isRetrying?: boolean;
  messages: readonly SchemaAiTaskMessageResponse[];
  onRetry?: (message: SchemaAiTaskMessageResponse) => void;
  optimisticTurn?: OptimisticGenerationTurn;
  onRetryOptimistic?: (turn: OptimisticGenerationTurn) => void;
  onUseAsReference?: (fileId: string) => void;
  onEditRequest?: (message: SchemaAiTaskMessageResponse) => void;
  onRegenerate?: (message: SchemaAiTaskMessageResponse) => void;
  comparedImageIds?: ReadonlySet<string>;
  comparisonLimitReached?: boolean;
  onToggleComparison?: (item: ImageComparisonItem) => void;
}

const normalizeImageIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter(
        (imageId): imageId is string =>
          typeof imageId === "string" && imageId.length > 0,
      )
    : [];

export const GenerationImageChats: FC<Props> = ({
  isRetrying,
  messages,
  onRetry,
  optimisticTurn,
  onRetryOptimistic,
  onUseAsReference,
  onEditRequest,
  onRegenerate,
  comparedImageIds,
  comparisonLimitReached,
  onToggleComparison,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const imageIndexOffsets = new Map<string, number>();
  let imageCount = 0;
  for (const message of messages) {
    imageIndexOffsets.set(message.uuid, imageCount);
    if (message.role === "ASSISTANT" && message.task_status !== "FAILED") {
      imageCount += normalizeImageIds(
        message.ai_model_config?.images_generated,
      ).length;
    }
  }

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-6">
      <GenerationChats
        copyUserMessages
        failureFallbackDescription={t(
          "pages.generation.image.generationError.content",
        )}
        failureRetryLabel={t("pages.generation.image.generationError.action")}
        failureTitle={t("pages.generation.image.generationError.title")}
        messages={messages}
        isRetrying={isRetrying}
        onRetry={onRetry}
        outputType="image"
        renderUserMessage={({ message, userImages }) => (
          <ImageRequestSummary
            prompt={
              message.message ?? String(message.ai_model_config?.prompt ?? "")
            }
            referenceImages={userImages}
          />
        )}
        renderAssistantResult={({
          generatedMedia,
          message,
          requestMessage,
        }) => (
          <div
            data-message-role="assistant"
            className="mr-auto w-full max-w-3xl"
          >
            <ImageResultCard
              images={generatedMedia}
              imageIndexOffset={imageIndexOffsets.get(message.uuid) ?? 0}
              message={message}
              requestMessage={requestMessage}
              onUseAsReference={onUseAsReference}
              onEditRequest={onEditRequest}
              onRegenerate={onRegenerate}
              disabled={isRetrying}
              comparedImageIds={comparedImageIds}
              comparisonLimitReached={comparisonLimitReached}
              onToggleComparison={onToggleComparison}
            />
          </div>
        )}
        getMedia={(message) => ({
          generatedMedia: normalizeImageIds(
            message.ai_model_config?.images_generated,
          ),
          placeholder: (
            <ImageGenerationPlaceholder
              key="image-generation-placeholder"
              label={t("pages.generation.image.generationLoading.content")}
              prompt={String(message.ai_model_config?.prompt ?? "")}
              aspectRatio={String(
                message.ai_model_config?.aspect_ratio ?? "1:1",
              )}
            />
          ),
          userImages: normalizeImageIds(
            message.ai_model_config?.reference_images,
          ),
        })}
      />
      {optimisticTurn && (
        <OptimisticImageTurn
          turn={optimisticTurn}
          isRetrying={isRetrying}
          onRetry={
            onRetryOptimistic
              ? () => onRetryOptimistic(optimisticTurn)
              : undefined
          }
        />
      )}
    </div>
  );
};
