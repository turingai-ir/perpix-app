import type { FC } from "react";

import { GenerationChats } from "@/pages/(app)/generation/_components/chats";
import { GenerationMediaPlaceholder } from "@/pages/(app)/generation/_components/generation-media-placeholder";
import { useAppTranslate } from "@/hooks";
import type { SchemaAiTaskMessageResponse } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

interface Props {
  isRetrying?: boolean;
  messages: readonly SchemaAiTaskMessageResponse[];
  onRetry?: (message: SchemaAiTaskMessageResponse) => void;
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
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <GenerationChats
      failureFallbackDescription={t(
        "pages.generation.image.generationError.content",
      )}
      failureRetryLabel={t("pages.generation.image.generationError.action")}
      failureTitle={t("pages.generation.image.generationError.title")}
      messages={messages}
      isRetrying={isRetrying}
      onRetry={onRetry}
      outputType="image"
      getMedia={(message) => ({
        generatedMedia: normalizeImageIds(
          message.ai_model_config?.images_generated,
        ),
        placeholder: (
          <GenerationMediaPlaceholder
            key="image-generation-placeholder"
            label={t("pages.generation.image.generationLoading.content")}
          />
        ),
        userImages: normalizeImageIds(
          message.ai_model_config?.reference_images,
        ),
      })}
    />
  );
};
