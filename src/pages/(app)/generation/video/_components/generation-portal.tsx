import type { CSSProperties } from "react";
import { Film, Sparkles } from "lucide-react";

import styles from "../studio.module.css";
import { useAppTranslate } from "@/hooks";

function toAspectRatio(value: string) {
  const [width, height] = value.split(":").map(Number);
  if (!width || !height || width <= 0 || height <= 0) return "16 / 9";
  return `${width} / ${height}`;
}

export function VideoGenerationPortal({
  aspectRatio,
  prompt,
}: {
  aspectRatio: string;
  prompt: string;
}) {
  const { t } = useAppTranslate();
  const keywords = prompt.trim().split(/\s+/).slice(0, 3);

  return (
    <section
      className={styles.generationPortal}
      data-video-generation-portal
      role="status"
      aria-live="polite"
      aria-label={t("pages.generation.video.generationLoading.content")}
      style={{ "--video-ratio": toAspectRatio(aspectRatio) } as CSSProperties}
    >
      <div className={styles.portalStage} aria-hidden="true">
        <div className={styles.portalRing} />
        <div className={styles.portalCore}>
          <Film />
        </div>
        <span className={styles.portalSweep} />
        <span className={styles.portalRailOne} />
        <span className={styles.portalRailTwo} />
      </div>
      <div className={styles.portalStatus}>
        <span>
          <Sparkles aria-hidden="true" />
          {t("pages.generation.video.studio.rendering")}
        </span>
        <strong>{t("pages.generation.video.studio.renderingTitle")}</strong>
        <p>{t("pages.generation.video.studio.renderingHint")}</p>
        {keywords.length > 0 ? (
          <div className={styles.promptKeywords} aria-hidden="true">
            {keywords.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
