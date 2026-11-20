import { useRef } from "react";
import { SAMPLE_WORDS, type CaptionTemplate } from "@perpix/caption-renderer";
import { CaptionPreview } from "@perpix/caption-renderer/react";
import { useAppTranslate } from "@/shared/hooks";
import { useElementSize } from "../../editor/hooks/use-element-size";

export function StyleSample({ template }: { template: CaptionTemplate }) {
  const { t } = useAppTranslate();
  const frame = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(frame);
  return (
    <div
      ref={frame}
      role="img"
      aria-label={t("features.studio.styles.preview")}
      className="bg-night rounded-card aspect-video w-full max-w-sm overflow-hidden"
    >
      {width > 0 && height > 0 && (
        <CaptionPreview
          template={template}
          words={SAMPLE_WORDS.fa}
          timeMs={1350}
          width={width}
          height={height}
          background={null}
        />
      )}
    </div>
  );
}
