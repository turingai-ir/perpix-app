import type { FC } from "react";

import { GenerationChats } from "@/pages/(app)/generation/_components/chats";
import { GenerationMediaPlaceholder } from "@/pages/(app)/generation/_components/generation-media-placeholder";
import { useAppTranslate } from "@/hook";
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

const uniqueImageIds = (...imageGroups: unknown[]) =>
  Array.from(new Set(imageGroups.flatMap(normalizeImageIds)));

export const GenerationVideoChats: FC<Props> = ({ messages }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <GenerationChats
      messages={messages}
      outputType="video"
      getMedia={(message) => ({
        generatedMedia: normalizeImageIds(
          message.ai_model_config?.videos_generated,
        ),
        placeholder: (
          <GenerationMediaPlaceholder
            key="video-generation-placeholder"
            label={t("pages.generation.video.generationLoading.content")}
          />
        ),
        userImages: uniqueImageIds(
          message.ai_model_config?.frame_images,
          message.ai_model_config?.reference_images,
        ),
      })}
    />
  );
};
