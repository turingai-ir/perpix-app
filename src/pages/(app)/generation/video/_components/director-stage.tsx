import { BookOpen, Clapperboard, Library, Sparkles } from "lucide-react";
import { useState } from "react";

import styles from "../studio.module.css";
import { useAppTranslate } from "@/hooks";

export function VideoDirectorStage() {
  const { t } = useAppTranslate();
  const [activeView, setActiveView] = useState<"library" | "guide">("library");

  return (
    <section className={styles.directorStage} data-video-director-stage>
      <div
        className={styles.workspaceTabs}
        role="group"
        aria-label={t("pages.generation.video.studio.workspaceNavigation")}
      >
        <button
          type="button"
          aria-pressed={activeView === "library"}
          onClick={() => setActiveView("library")}
        >
          <Library aria-hidden="true" />
          {t("pages.generation.video.studio.motionLibrary")}
        </button>
        <button
          type="button"
          aria-pressed={activeView === "guide"}
          onClick={() => setActiveView("guide")}
        >
          <BookOpen aria-hidden="true" />
          {t("pages.generation.video.studio.howItWorks")}
        </button>
      </div>
      {activeView === "library" ? (
        <div className={styles.libraryView}>
          <div className={styles.featureFrame} data-testid="video-director-rig">
            <div className={styles.frameScene} aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <span>
              <Clapperboard aria-hidden="true" />
              {t("pages.generation.video.studio.featuredMotion")}
            </span>
          </div>
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
          <div className={styles.motionGrid} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
      ) : (
        <div className={styles.guideView}>
          <span className={styles.eyebrow}>
            <BookOpen aria-hidden="true" />
            {t("pages.generation.video.studio.howItWorks")}
          </span>
          <h1>{t("pages.generation.video.studio.guideTitle")}</h1>
          <ol>
            <li>{t("pages.generation.video.studio.guide.reference")}</li>
            <li>{t("pages.generation.video.studio.guide.direction")}</li>
            <li>{t("pages.generation.video.studio.guide.generate")}</li>
          </ol>
        </div>
      )}
    </section>
  );
}
