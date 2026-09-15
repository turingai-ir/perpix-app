import type { FC } from "react";

import { GenerationChats } from "@/pages/(app)/generation/_components/chats";
import { useAppTranslate } from "@/hooks";
import type { SchemaAiTaskMessageResponse } from "@/services/api";
import type { OptimisticGenerationTurn } from "@/pages/(app)/generation/_types/conversation";
import { OptimisticImageTurn } from "./optimistic-turn";
import { ImageResultCard } from "./result-card";
import { APP_I18_KEYS } from "@/services/i18";
import { ImageGenerationPlaceholder } from "./image-generation-placeholder";

interface Props {
  isRetrying?: boolean;
  messages: readonly SchemaAiTaskMessageResponse[];
  onRetry?: (message: SchemaAiTaskMessageResponse) => void;
  optimisticTurn?: OptimisticGenerationTurn;
  onRetryOptimistic?: (turn: OptimisticGenerationTurn) => void;
  onUseAsReference?: (fileId: string) => void;
  onEditRequest?: (message: SchemaAiTaskMessageResponse) => void;
  onRegenerate?: (message: SchemaAiTaskMessageResponse) => void;
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
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="flex w-full flex-col gap-2">
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
        renderAssistantResult={({
          generatedMedia,
          message,
          requestMessage,
        }) => (
          <ImageResultCard
            images={generatedMedia}
            message={message}
            requestMessage={requestMessage}
            onUseAsReference={onUseAsReference}
            onEditRequest={onEditRequest}
            onRegenerate={onRegenerate}
            disabled={isRetrying}
          />
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
