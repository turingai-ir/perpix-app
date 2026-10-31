import styles from "../studio.module.css";
import { useAppTranslate } from "@/hooks";
import { VideoBrandCinema } from "./brand-cinema";

export function VideoGenerationPortal({
  aspectRatio,
}: {
  aspectRatio: string;
}) {
  const { t } = useAppTranslate();

  return (
    <section
      className={styles.generationPortal}
      data-video-generation-portal
      aria-label={t("pages.generation.video.generationLoading.content")}
    >
      <VideoBrandCinema rendering aspectRatio={aspectRatio} />
      <div className={styles.portalStatus} role="status" aria-live="polite">
        <strong>{t("pages.generation.video.studio.renderingTitle")}</strong>
        <p>{t("pages.generation.video.studio.renderingHint")}</p>
      </div>
    </section>
  );
}
