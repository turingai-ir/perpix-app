import { Aperture, Clapperboard, Sparkles } from "lucide-react";

import styles from "../studio.module.css";
import { useAppTranslate } from "@/hooks";

export function VideoDirectorStage() {
  const { t } = useAppTranslate();

  return (
    <section className={styles.directorStage} data-video-director-stage>
      <div className={styles.stageCopy}>
        <span className={styles.eyebrow}>
          <Sparkles aria-hidden="true" />
          {t("pages.generation.video.studio.eyebrow")}
        </span>
        <h1>{t("pages.generation.video.studio.heroTitle")}</h1>
        <p>{t("pages.generation.video.studio.heroDescription")}</p>
        <div className={styles.directionHints} aria-hidden="true">
          <span>{t("pages.generation.video.studio.recipe.subject")}</span>
          <span>{t("pages.generation.video.studio.recipe.movement")}</span>
          <span>{t("pages.generation.video.studio.recipe.light")}</span>
        </div>
      </div>

      <div className={styles.cinemaRig} aria-hidden="true">
        <div className={styles.portalHalo} />
        <div className={styles.orbitOne} />
        <div className={styles.orbitTwo} />
        <div className={styles.cameraFrame} data-testid="video-director-rig">
          <div className={styles.frameLight} />
          <Aperture className={styles.apertureIcon} />
          <Clapperboard className={styles.clapperIcon} />
        </div>
        <div className={styles.frameEchoOne} />
        <div className={styles.frameEchoTwo} />
        <div className={styles.scanLine} />
      </div>
    </section>
  );
}
