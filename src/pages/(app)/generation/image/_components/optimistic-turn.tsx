import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChatBubble } from "@/components/custom";
import { GenerationFailure } from "@/pages/(app)/generation/_components/generation-failure";
import { ImageGenerationPlaceholder } from "./image-generation-placeholder";
import type { OptimisticGenerationTurn } from "@/pages/(app)/generation/_types/conversation";
import { useAppTranslate } from "@/hooks";

export function OptimisticImageTurn({
  turn,
  isRetrying,
  onRetry,
}: {
  turn: OptimisticGenerationTurn;
  isRetrying?: boolean;
  onRetry?: () => void;
}) {
  const { t } = useAppTranslate();
  const aspectRatio = String(turn.snapshot.config.aspect_ratio ?? "1:1");
  return (
    <div
      className="flex w-full flex-col gap-2"
      data-client-attempt={turn.clientAttemptId}
    >
      <div className="ms-auto w-full max-w-125">
        <ChatBubble
          copyMessage
          sender="user"
          avatar={null}
          message={turn.snapshot.prompt}
          images={[...turn.snapshot.referenceImages]}
        />
      </div>
      <div
        className="me-auto w-full max-w-125"
        aria-busy={turn.status !== "failed"}
      >
        {turn.status === "failed" ? (
          <GenerationFailure
            title={t("pages.generation.image.chat.sendFailed")}
            description={t("pages.generation.image.chat.sendFailedHint")}
            retryLabel={t("pages.generation.image.chat.retry")}
            isRetrying={Boolean(isRetrying)}
            onRetry={onRetry}
          />
        ) : (
          <ChatBubble
            sender="agent"
            avatar={
              <Avatar>
                <AvatarImage
                  src="/android-chrome-512x512.png"
                  className="grayscale"
                />
              </Avatar>
            }
            images={[
              <ImageGenerationPlaceholder
                key="optimistic-image-placeholder"
                label={t("pages.generation.image.generationLoading.content")}
                prompt={turn.snapshot.prompt}
                aspectRatio={aspectRatio}
              />,
            ]}
          />
        )}
      </div>
    </div>
  );
}
