import type { FC, ReactNode } from "react";

import { GenerationFailure } from "./generation-failure";

import { ChatBubble } from "@/components/custom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  AiTaskRuleEnumMap,
  type SchemaAiTaskMessageResponse,
} from "@/services/api";

interface GenerationChatMedia {
  generatedMedia: string[];
  placeholder: ReactNode;
  userImages?: string[];
}

interface Props {
  failureFallbackDescription: string;
  failureRetryLabel: string;
  failureTitle: string;
  getMedia: (message: SchemaAiTaskMessageResponse) => GenerationChatMedia;
  isRetrying?: boolean;
  messages: readonly SchemaAiTaskMessageResponse[];
  onRetry?: (message: SchemaAiTaskMessageResponse) => void;
  outputType: "image" | "video";
}

const LOADING_STATUSES = new Set(["PENDING", "IN_PROGRESS"]);

export const GenerationChats: FC<Props> = ({
  failureFallbackDescription,
  failureRetryLabel,
  failureTitle,
  getMedia,
  isRetrying = false,
  messages,
  onRetry,
  outputType,
}) => {
  if (!messages.length) return null;

  return (
    <div className="flex w-full flex-col gap-2">
      {messages.map((item) => {
        const { generatedMedia, placeholder, userImages } = getMedia(item);
        const isUser = item.role === AiTaskRuleEnumMap.USER;
        const isAssistant = item.role === AiTaskRuleEnumMap.ASSISTANT;
        const isGenerating =
          isAssistant &&
          !generatedMedia.length &&
          LOADING_STATUSES.has(item.task_status ?? "");
        const isFailed = isAssistant && item.task_status === "FAILED";
        const failureDescription = item.message || failureFallbackDescription;

        return (
          <div
            id={item.uuid}
            key={item.uuid}
            className={cn("w-full max-w-125", {
              "ml-auto": isUser,
              "mr-auto": !isUser,
            })}
          >
            {isFailed ? (
              <GenerationFailure
                description={failureDescription}
                isRetrying={isRetrying}
                onRetry={
                  item.ai_model_uuid && onRetry
                    ? () => onRetry(item)
                    : undefined
                }
                retryLabel={failureRetryLabel}
                title={failureTitle}
              />
            ) : null}
            <ChatBubble
              sender={isUser ? "user" : "agent"}
              avatar={
                <Avatar>
                  <AvatarImage
                    src="/android-chrome-512x512.png"
                    className="grayscale"
                  />
                </Avatar>
              }
              message={
                isGenerating || isFailed ? undefined : (item.message ?? "")
              }
              images={
                isUser
                  ? userImages
                  : outputType === "image"
                    ? isGenerating
                      ? [placeholder]
                      : generatedMedia
                    : undefined
              }
              videos={
                !isUser && outputType === "video"
                  ? isGenerating
                    ? [placeholder]
                    : generatedMedia
                  : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
};
