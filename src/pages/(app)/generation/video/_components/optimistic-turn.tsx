import { GenerationFailure } from "@/pages/(app)/generation/_components/generation-failure";
import type { OptimisticGenerationTurn } from "@/pages/(app)/generation/_types/conversation";
import { useAppTranslate } from "@/hooks";
import { VideoGenerationPortal } from "./generation-portal";
import { VideoRequestSummary } from "./request-summary";

const normalizeIds = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

export function OptimisticVideoTurn({
  turn,
  isRetrying,
}: {
  turn: OptimisticGenerationTurn;
  isRetrying?: boolean;
}) {
  const { t } = useAppTranslate();
  const config = turn.snapshot.config;
  const images = [
    ...normalizeIds(config.frame_images),
    ...normalizeIds(config.reference_images),
  ];

  return (
    <div
      className="flex w-full flex-col gap-5 sm:gap-6"
      data-client-attempt={turn.clientAttemptId}
    >
      <VideoRequestSummary
        prompt={turn.snapshot.prompt}
        referenceImages={images}
      />
      <div data-message-role="assistant" className="mr-auto w-full max-w-3xl">
        {turn.status === "failed" ? (
          <GenerationFailure
            title={t("pages.generation.video.generationError.title")}
            description={t("pages.generation.video.studio.sendFailedHint")}
            retryLabel={t("pages.generation.video.generationError.action")}
            isRetrying={Boolean(isRetrying)}
          />
        ) : (
          <VideoGenerationPortal
            aspectRatio={String(config.aspect_ratio ?? "16:9")}
            prompt={turn.snapshot.prompt}
          />
        )}
      </div>
    </div>
  );
}
