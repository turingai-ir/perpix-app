import { useRef, type FC, type RefObject } from "react";
import { CaptionPreview } from "@perpix/caption-renderer/react";
import type { CaptionTemplate, CaptionWord } from "@perpix/caption-renderer";
import { useElementSize } from "../hooks/use-element-size";

interface EditorStageProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  words: readonly CaptionWord[];
  template: CaptionTemplate;
  timeMs: number;
  onToggle: () => void;
  label: string;
}

/**
 * The picture as it will be exported: a portrait frame with the video fitted
 * inside and the caption drawn on top by the same renderer the export uses.
 * Tapping the frame plays or pauses.
 */
export const EditorStage: FC<EditorStageProps> = ({
  videoRef,
  words,
  template,
  timeMs,
  onToggle,
  label,
}) => {
  const frame = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(frame);

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-night p-2">
      <div
        ref={frame}
        className="relative aspect-[9/16] h-full max-w-full overflow-hidden rounded-xl bg-night"
      >
        {/* The caption is drawn on the canvas below, and the words are in the transcript list. */}
        {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-contain"
          playsInline
          preload="auto"
          data-testid="stage-video"
        />
        {width > 0 && height > 0 && (
          <CaptionPreview
            className="pointer-events-none absolute inset-0"
            template={template}
            words={words}
            timeMs={timeMs}
            width={width}
            height={height}
            background={null}
          />
        )}
        <button
          type="button"
          aria-label={label}
          className="absolute inset-0 cursor-pointer focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
          onClick={onToggle}
        />
      </div>
    </div>
  );
};
