import { Aperture, ArrowDown, Film, Focus, Play } from "lucide-react";

import styles from "../studio.module.css";
import { useAppTranslate } from "@/hooks";

export function VideoStudioPreview({ hasResults }: { hasResults: boolean }) {
  const { t } = useAppTranslate();
  return (
    <section
      className={styles.preview}
      aria-label={t("pages.generation.video.studio.preview")}
    >
      <div className={styles.monitorHeader}>
        <span>
          <Film aria-hidden="true" size={15} />
          {t("pages.generation.video.studio.preview")}
        </span>
        <span className={styles.monitorBadge}>
          {t("pages.generation.video.studio.concept")}
        </span>
      </div>
      <div className={styles.scene} aria-hidden="true">
        <div className={styles.sceneGrid} />
        <div className={styles.filmStack} data-testid="video-studio-film">
          <div className={styles.backFrame} />
          <div className={styles.middleFrame} />
          <div className={styles.frontFrame}>
            <div className={styles.orb} />
            <div className={styles.horizon} />
            <div className={styles.frameCorners}>
              <Focus size={32} strokeWidth={1} />
            </div>
            <span className={styles.play}>
              <Play size={24} fill="currentColor" />
            </span>
            <div className={styles.filmPerforation} />
          </div>
        </div>
        <span className={styles.aperture}>
          <Aperture size={30} strokeWidth={1} />
        </span>
      </div>
      <div className={styles.previewCopy}>
        <span className={styles.eyebrow}>
          {t("pages.generation.video.studio.canvasEyebrow")}
        </span>
        <h2>{t("pages.generation.video.studio.canvasTitle")}</h2>
        <p>{t("pages.generation.video.studio.canvasDescription")}</p>
      </div>
      <div className={styles.shotRecipe}>
        {["subject", "movement", "light"].map((key, index) => (
          <span key={key}>
            <b aria-hidden="true">0{index + 1}</b>
            {t(`pages.generation.video.studio.recipe.${key}`)}
          </span>
        ))}
      </div>
      <p className={styles.previewNote}>
        <ArrowDown aria-hidden="true" size={15} />
        {t(
          hasResults
            ? "pages.generation.video.studio.resultsBelow"
            : "pages.generation.video.studio.emptyNote",
        )}
      </p>
    </section>
  );
}
