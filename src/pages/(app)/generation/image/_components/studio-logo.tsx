import { useEffect, useState } from "react";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "../studio.module.css";

const motions = ["orbit", "wave", "float"] as const;

export default function StudioLogo() {
  const [motion, setMotion] = useState<(typeof motions)[number]>("orbit");
  const [active, setActive] = useState(false);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nextRun: ReturnType<typeof setTimeout>;
    let finishRun: ReturnType<typeof setTimeout>;
    let previous = -1;
    const clearTimers = () => {
      clearTimeout(nextRun);
      clearTimeout(finishRun);
    };
    const play = () => {
      if (document.hidden || reducedMotion.matches) return;
      const choices = motions.filter((_, index) => index !== previous);
      const selected = choices[Math.floor(Math.random() * choices.length)];
      previous = motions.indexOf(selected);
      setMotion(selected);
      setActive(true);
      finishRun = setTimeout(() => setActive(false), 4000);
      nextRun = setTimeout(play, 60_000);
    };
    const syncPlayback = () => {
      clearTimers();
      setActive(false);
      if (!document.hidden && !reducedMotion.matches) {
        nextRun = setTimeout(play, 0);
      }
    };
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    nextRun = setTimeout(play, 0);
    return () => {
      clearTimers();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
    };
  }, []);
  return (
    <div className={styles.logoSection}>
      <div
        className={`${styles.stage} ${styles[motion]}`}
        data-testid="studio-logo"
        data-motion={motion}
        data-active={active}
      >
        <span className={styles.ring} aria-hidden="true" />
        <span className={styles.echo} aria-hidden="true" />
        <img
          src="/android-chrome-512x512.png"
          alt={t("pages.designPreview.logoAlt")}
          className={styles.logo}
        />
      </div>
    </div>
  );
}
