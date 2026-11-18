import { ImagePlus, Sparkles } from "lucide-react";

import styles from "./editor-onboarding-art.module.css";

export function EditorOnboardingArt() {
  return (
    <div className={styles.editorOnboardingArt} aria-hidden="true">
      <div className={`${styles.editorOnboardingOrbit} ${styles.orbitOne}`} />
      <div className={`${styles.editorOnboardingOrbit} ${styles.orbitTwo}`} />
      <div
        className={`${styles.editorOnboardingArtCard} ${styles.artCardBack}`}
      >
        <span className={styles.artCardTop}>PERPIX / 01</span>
        <span className={styles.artCardSun} />
        <span className={styles.artCardLandscape} />
      </div>
      <div
        className={`${styles.editorOnboardingArtCard} ${styles.artCardFront}`}
      >
        <span className={styles.artCardTop}>
          <ImagePlus size={15} /> STUDIO / PREVIEW
        </span>
        <span className={`${styles.artCardShape} ${styles.shapeOne}`} />
        <span className={`${styles.artCardShape} ${styles.shapeTwo}`} />
        <span className={styles.artCardSheen} />
      </div>
      <div className={styles.editorOnboardingArtChip}>
        <Sparkles size={16} /> CREATE · EDIT · EXPORT
      </div>
    </div>
  );
}
