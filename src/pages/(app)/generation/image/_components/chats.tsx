import type { FC } from "react";

import { GenerationChats } from "@/pages/(app)/generation/_components/chats";
import { GenerationMediaPlaceholder } from "@/pages/(app)/generation/_components/generation-media-placeholder";
import { useAppTranslate } from "@/hooks";
import type { SchemaAiTaskMessageResponse } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

interface Props {
  messages: readonly SchemaAiTaskMessageResponse[];
}

const normalizeImageIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter(
        (imageId): imageId is string =>
          typeof imageId === "string" && imageId.length > 0,
      )
    : [];

export const GenerationImageChats: FC<Props> = ({ messages }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <GenerationChats
      messages={messages}
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
