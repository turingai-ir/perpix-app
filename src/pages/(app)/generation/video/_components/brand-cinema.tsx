import { useRef, useState, type CSSProperties } from "react";
import { Clapperboard, Pause, Play } from "lucide-react";
import { useAnimationVisibility } from "@/hooks/use-animation-visibility";

import { useAppTranslate } from "@/hooks";
import styles from "./brand-cinema.module.css";
import { VideoIdleScene } from "./video-idle-scene";

export function VideoBrandCinema({
  rendering = false,
  aspectRatio = "16:9",
}: {
  rendering?: boolean;
  aspectRatio?: string;
}) {
  const { t } = useAppTranslate();
  const stageRef = useRef<HTMLDivElement>(null);
  const active = useAnimationVisibility(stageRef);
  const [paused, setPaused] = useState(false);
  const [width, height] = aspectRatio.split(":").map(Number);
  const validRatio = Number.isFinite(width / height) && width > 0 && height > 0;

  return (
    <div
      ref={stageRef}
      className={styles.cinema}
      data-video-cinema={rendering ? "rendering" : "idle"}
      data-paused={paused || !active}
      style={
        {
          "--frame-ratio": validRatio ? `${width} / ${height}` : "16 / 9",
        } as CSSProperties
      }
    >
      {rendering ? (
        <>
          <div className={styles.heroFrame} data-video-preview-frame>
            <div className={styles.guides} aria-hidden="true" />
            <span className={styles.scan} aria-hidden="true" />
            <Clapperboard className={styles.mark} aria-hidden="true" />
            <span className={styles.frameLabel}>
              {t("pages.generation.video.studio.framePlaceholder")}
            </span>
          </div>
          <div className={styles.timeline} aria-hidden="true">
            {Array.from({ length: 7 }, (_, frame) => (
              <i key={frame} />
            ))}
          </div>
        </>
      ) : (
        <VideoIdleScene />
      )}
      {rendering && (
        <button
          type="button"
          className={styles.motionToggle}
          onClick={() => setPaused(!paused)}
          aria-label={t(
            paused
              ? "pages.generation.video.studio.resumeAnimation"
              : "pages.generation.video.studio.pauseAnimation",
          )}
          aria-pressed={paused}
        >
          {paused ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
