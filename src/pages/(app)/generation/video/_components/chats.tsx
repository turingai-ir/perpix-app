import type { FC } from "react";

import { OptimisticVideoTurn } from "./optimistic-turn";
import { VideoGenerationPortal } from "./generation-portal";
import { VideoRequestSummary } from "./request-summary";

import { GenerationChats } from "@/pages/(app)/generation/_components/chats";
import { useAppTranslate } from "@/hooks";
import type { SchemaAiTaskMessageResponse } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import type { OptimisticGenerationTurn } from "@/pages/(app)/generation/_types/conversation";

interface Props {
  isRetrying?: boolean;
  messages: readonly SchemaAiTaskMessageResponse[];
  onRetry?: (message: SchemaAiTaskMessageResponse) => void;
  optimisticTurn?: OptimisticGenerationTurn;
}

const normalizeImageIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter(
        (imageId): imageId is string =>
          typeof imageId === "string" && imageId.length > 0,
      )
    : [];

const uniqueImageIds = (...imageGroups: unknown[]) =>
  Array.from(new Set(imageGroups.flatMap(normalizeImageIds)));

export const GenerationVideoChats: FC<Props> = ({
  isRetrying,
  messages,
  onRetry,
  optimisticTurn,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-6">
      <GenerationChats
        failureFallbackDescription={t(
          "pages.generation.video.generationError.content",
        )}
        failureRetryLabel={t("pages.generation.video.generationError.action")}
        failureTitle={t("pages.generation.video.generationError.title")}
        messages={messages}
        isRetrying={isRetrying}
        onRetry={onRetry}
        outputType="video"
        renderUserMessage={({ message, userImages }) => (
          <VideoRequestSummary
            prompt={
              message.message ?? String(message.ai_model_config?.prompt ?? "")
            }
            referenceImages={userImages}
          />
        )}
        getMedia={(message) => ({
          generatedMedia: normalizeImageIds(
            message.ai_model_config?.videos_generated,
          ),
          placeholder: (
            <VideoGenerationPortal
              key="video-generation-placeholder"
              aspectRatio={String(
                message.ai_model_config?.aspect_ratio ?? "16:9",
              )}
              prompt={String(message.ai_model_config?.prompt ?? "")}
            />
          ),
          userImages: uniqueImageIds(
            message.ai_model_config?.frame_images,
            message.ai_model_config?.reference_images,
          ),
        })}
      />
      {optimisticTurn ? (
        <OptimisticVideoTurn turn={optimisticTurn} isRetrying={isRetrying} />
      ) : null}
    </div>
  );
};
