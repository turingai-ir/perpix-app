import { useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MediaPreviewItem } from "@/components/custom/media-preview-item";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";

export function VideoRequestSummary({
  prompt,
  referenceImages,
}: {
  prompt: string;
  referenceImages: readonly string[];
}) {
  const { t } = useAppTranslate();
  const [expanded, setExpanded] = useState(false);
  const promptId = useId();
  const isLong = prompt.length > 280 || prompt.split("\n").length > 4;
  return (
    <div
      data-message-role="user"
      data-video-request-summary
      className="ml-auto flex w-fit max-w-[min(95%,42rem)] min-w-0 flex-col items-end gap-2"
    >
      {referenceImages.length > 0 ? (
        <div className="flex max-w-72 flex-wrap justify-end gap-2">
          {referenceImages.map((fileId, index) => (
            <div key={fileId} className="size-20 overflow-hidden rounded-2xl">
              <MediaPreviewItem
                fileId={fileId}
                fit="contain"
                index={index}
                type="image"
              />
            </div>
          ))}
        </div>
      ) : null}
      <div className="border-primary/10 bg-muted/75 max-w-full rounded-2xl rounded-se-md border px-4 py-3">
        <p
          id={promptId}
          dir="auto"
          className={`text-start text-sm leading-7 wrap-anywhere whitespace-pre-wrap sm:text-[0.95rem] ${isLong && !expanded ? "line-clamp-4" : ""}`}
        >
          {prompt}
        </p>
        {isLong ? (
          <Button
            type="button"
            variant="ghost"
            className="text-primary mt-2 min-h-11"
            aria-expanded={expanded}
            aria-controls={promptId}
            onClick={() => setExpanded(!expanded)}
          >
            {t(
              expanded
                ? "pages.generation.video.studio.collapsePrompt"
                : "pages.generation.video.studio.expandPrompt",
            )}
            {expanded ? (
              <ChevronUp aria-hidden="true" />
            ) : (
              <ChevronDown aria-hidden="true" />
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
