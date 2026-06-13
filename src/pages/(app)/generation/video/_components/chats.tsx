import type { FC } from "react";
import {
  AiTaskRuleEnumMap,
  type SchemaAiTaskMessageResponse,
} from "@/services/api";
import { ChatBubble } from "@/components/custom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { APP_I18_KEYS } from "@/services/i18";
import { useAppTranslate } from "@/hook";

interface Props {
  messages: readonly SchemaAiTaskMessageResponse[];
}

function normalizeImageIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (imageId): imageId is string =>
      typeof imageId === "string" && imageId.length > 0,
  );
}

function uniqueImageIds(...imageGroups: unknown[]) {
  return Array.from(new Set(imageGroups.flatMap(normalizeImageIds)));
}

export const GenerationVideoChats: FC<Props> = ({ messages }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  if (!messages.length) return null;

  return (
    <div className="flex w-full flex-col gap-2">
      {messages.map((item) => {
        const videosGenerated = (item.ai_model_config?.videos_generated ??
          []) as Array<string>;
        const inputImages = uniqueImageIds(
          item.ai_model_config?.frame_images,
          item.ai_model_config?.reference_images,
        );
        const isAssistant = item.role === AiTaskRuleEnumMap.ASSISTANT;
        const isGeneratingVideo =
          isAssistant &&
          !videosGenerated.length &&
          (item.task_status === "PENDING" ||
            item.task_status === "IN_PROGRESS" ||
            item.task_status === "SUCCESS");

        return (
          <div
            key={item.uuid}
            className={cn("w-full max-w-125", {
              "ml-auto": item.role === AiTaskRuleEnumMap.USER,
              "mr-auto": item.role !== AiTaskRuleEnumMap.USER,
            })}
          >
            <ChatBubble
              sender={item.role === "USER" ? "user" : "agent"}
              avatar={
                <Avatar>
                  <AvatarImage
                    src="/android-chrome-512x512.png"
                    className="grayscale"
                  />
                </Avatar>
              }
              message={
                isGeneratingVideo
                  ? t("pages.generation.video.generationLoading.content")
                  : (item.message ?? "")
              }
              status={item.task_status}
              images={item.role === "USER" ? inputImages : undefined}
              videos={item.role === "USER" ? undefined : videosGenerated}
            />
          </div>
        );
      })}
    </div>
  );
};
