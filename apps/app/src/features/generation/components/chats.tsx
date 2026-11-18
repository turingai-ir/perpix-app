import type { FC, ReactNode } from "react";

import { GenerationFailure } from "./generation-failure";
import { GenerationReview } from "./generation-review";

import { ChatBubble } from "@/features/generation/components/media-output/chat-bubble";
import { getFailureHintKey } from "@/features/generation/model/failure-hint";
import {
  getFailureTitleKey,
  isFailureFree,
  isUnderReview,
} from "@/features/generation/model/failure-details";
import { useAppTranslate } from "@/shared/hooks";
import { isRetryableFailure } from "@/features/generation/model/task-message-status";
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";
import {
  AiTaskRuleEnumMap,
  type SchemaAiTaskMessageResponse,
} from "@/shared/api";

interface GenerationChatMedia {
  generatedMedia: string[];
  placeholder: ReactNode;
  userImages?: string[];
}

interface Props {
  copyUserMessages?: boolean;
  failureFallbackDescription: string;
  failureRetryLabel: string;
  failureTitle: string;
  getMedia: (message: SchemaAiTaskMessageResponse) => GenerationChatMedia;
  isRetrying?: boolean;
  messages: readonly SchemaAiTaskMessageResponse[];
  onRetry?: (message: SchemaAiTaskMessageResponse) => void;
  outputType: "image" | "video";
  renderUserMessage?: (input: {
    message: SchemaAiTaskMessageResponse;
    userImages: string[];
  }) => ReactNode;
  renderAssistantResult?: (input: {
    generatedMedia: string[];
    message: SchemaAiTaskMessageResponse;
    requestMessage?: SchemaAiTaskMessageResponse;
  }) => ReactNode;
}

// SUCCESS without media is not terminal in the API contract; keep a visible
// recovery state while result polling waits for the file identifiers.
const LOADING_STATUSES = new Set(["PENDING", "IN_PROGRESS"]);

export const GenerationChats: FC<Props> = ({
  copyUserMessages = false,
  failureFallbackDescription,
  failureRetryLabel,
  failureTitle,
  getMedia,
  isRetrying = false,
  messages,
  onRetry,
  outputType,
  renderUserMessage,
  renderAssistantResult,
}) => {
  const { t } = useAppTranslate();
  if (!messages.length) return null;

  return (
    <div className="flex w-full flex-col gap-2">
      {messages.map((item, messageIndex) => {
        const { generatedMedia, placeholder, userImages } = getMedia(item);
        const isUser = item.role === AiTaskRuleEnumMap.USER;
        const isAssistant = item.role === AiTaskRuleEnumMap.ASSISTANT;
        if (!isUser && !isAssistant) return null;
        const inReview = isAssistant && isUnderReview(item);
        const isGenerating =
          isAssistant &&
          !inReview &&
          !generatedMedia.length &&
          LOADING_STATUSES.has(item.task_status ?? "");
        // SUCCESS is final: without media the provider produced no output.
        const isFailed =
          isAssistant &&
          (item.task_status === "FAILED" ||
            (item.task_status === "SUCCESS" && !generatedMedia.length));
        const failureDescription =
          item.error?.message || item.message || failureFallbackDescription;
        const hintKey = isFailed ? getFailureHintKey(item.error) : undefined;
        const failureTitleKey = isFailed ? getFailureTitleKey(item) : undefined;
        const requestMessage = [...messages.slice(0, messageIndex)]
          .reverse()
          .find((message) => message.role === AiTaskRuleEnumMap.USER);
        const assistantResult =
          isAssistant && generatedMedia.length && renderAssistantResult
            ? renderAssistantResult({
                generatedMedia,
                message: item,
                requestMessage,
              })
            : undefined;
        const userMessage =
          isUser && renderUserMessage
            ? renderUserMessage({ message: item, userImages: userImages ?? [] })
            : undefined;

        return (
          <div
            id={item.uuid}
            key={item.uuid}
            className={cn("w-full", {
              "max-w-125": !assistantResult && !userMessage,
              "max-w-full": assistantResult || userMessage,
              "ml-auto": isUser,
              "mr-auto": !isUser,
            })}
          >
            {isFailed ? (
              <GenerationFailure
                description={failureDescription}
                hint={hintKey ? t(hintKey) : undefined}
                notice={
                  isFailureFree(item)
                    ? t("common.generationFailure.notCharged")
                    : undefined
                }
                isRetrying={isRetrying}
                onRetry={
                  item.ai_model_uuid && onRetry && isRetryableFailure(item)
                    ? () => onRetry(item)
                    : undefined
                }
                retryLabel={failureRetryLabel}
                title={failureTitleKey ? t(failureTitleKey) : failureTitle}
                trackingCode={item.uuid}
              />
            ) : inReview ? (
              <GenerationReview trackingCode={item.uuid} />
            ) : userMessage ? (
              userMessage
            ) : assistantResult ? (
              assistantResult
            ) : (
              <ChatBubble
                copyMessage={copyUserMessages}
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
            )}
          </div>
        );
      })}
    </div>
  );
};
