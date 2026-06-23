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
import { GenerationMediaPlaceholder } from "@/pages/(app)/generation/_components/generation-media-placeholder";

interface Props {
  messages: readonly SchemaAiTaskMessageResponse[];
}
export const GenerationImageChats: FC<Props> = ({ messages }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  if (!messages.length) return null;

  return (
    <div className="flex w-full flex-col gap-2">
      {messages.map((item) => {
        const imagesGenerated = (item.ai_model_config?.images_generated ??
          []) as Array<string>;
        const isAssistant = item.role === AiTaskRuleEnumMap.ASSISTANT;
        const isGeneratingImage =
          isAssistant &&
          !imagesGenerated.length &&
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
              message={isGeneratingImage ? undefined : (item.message ?? "")}
              status={item.task_status}
              images={
                item.role === "USER"
                  ? ((item.ai_model_config?.reference_images ??
                      []) as Array<string>)
                  : isGeneratingImage
                    ? [
                        <GenerationMediaPlaceholder
                          key="image-generation-placeholder"
                          label={t(
                            "pages.generation.image.generationLoading.content",
                          )}
                        />,
                      ]
                    : imagesGenerated
              }
            />
          </div>
        );
      })}
    </div>
  );
};
