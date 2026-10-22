import { useAppTranslate } from "@/hooks";
import styles from "./brand-cinema.module.css";

export function VideoIdleScene() {
  const { t } = useAppTranslate();

  return (
    <div className={styles.idleScene}>
      <div className={styles.sceneAura} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true" />
      <div
        className={`${styles.sideFrame} ${styles.sideFrameBefore}`}
        aria-hidden="true"
      >
        <i />
      </div>
      <div
        className={`${styles.sideFrame} ${styles.sideFrameAfter}`}
        aria-hidden="true"
      >
        <i />
      </div>
      <div className={styles.storyFrame} data-video-preview-frame>
        <div className={styles.sceneGrid} aria-hidden="true" />
        <div className={styles.sceneSun} aria-hidden="true" />
        <div className={styles.scenePortal} aria-hidden="true" />
        <div className={styles.sceneFacet} aria-hidden="true" />
        <div className={styles.sceneShard} aria-hidden="true" />
        <div className={styles.sceneRay} aria-hidden="true" />
        <div className={styles.sceneFloor} aria-hidden="true" />
        <span className={styles.sceneLabel}>
          <span className={styles.recordDot} aria-hidden="true" />
          {t("pages.generation.video.studio.framePlaceholder")}
        </span>
        <span className={styles.frameIndex} aria-hidden="true">
          01 / 07
        </span>
      </div>
      <div className={styles.storyRail} aria-hidden="true">
        {Array.from({ length: 7 }, (_, frame) => (
          <i key={frame} />
        ))}
      </div>
    </div>
  );
}
