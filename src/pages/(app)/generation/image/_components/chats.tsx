import type { FC } from "react";
import { useAiGenerate } from "../_hooks";
import { AiTaskRuleEnumMap, type SchemaAiTaskResponse } from "@/services/api";
import { ChatBubble } from "@/components/custom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Props {
  chatId?: string;
}
export const GenerationImageChats: FC<Props> = ({ chatId }) => {
  const { aiTaskState } = useAiGenerate(chatId);
  const aiTaskMessages = aiTaskState.isSuccess
    ? (aiTaskState.data as SchemaAiTaskResponse)?.messages
    : [];

  if (!aiTaskState.isSuccess) return null;
  return (
    <div className="flex w-full flex-col gap-2">
      {aiTaskMessages.map((item) => {
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
              message={item.message ?? ""}
              images={
                item.role === "USER"
                  ? ((item.ai_model_config?.images_reference ??
                      []) as Array<string>)
                  : ((item.ai_model_config?.images_generated ??
                      []) as Array<string>)
              }
            />
          </div>
        );
      })}
    </div>
  );
};
