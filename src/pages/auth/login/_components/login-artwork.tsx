import { useState, type PointerEvent } from "react";
import { Pause, Play } from "lucide-react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "../login.module.css";

export default function LoginArtwork() {
  const [paused, setPaused] = useState(false);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  function moveLight(event: PointerEvent<HTMLDivElement>) {
    if (
      paused ||
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${-y * 12}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 16}deg`);
  }

  function resetLight(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.removeProperty("--tilt-x");
    event.currentTarget.style.removeProperty("--tilt-y");
  }

  return (
    <>
      <div
        className={styles.artwork}
        aria-hidden="true"
        data-paused={paused}
        onPointerMove={moveLight}
        onPointerLeave={resetLight}
      >
        <div className={styles.depth}>
          <div className={styles.orbit} />
          <div className={styles.energyRing} />
          <img
            className={styles.heroLogo}
            src="/android-chrome-512x512.png"
            alt=""
            width="512"
            height="512"
          />
        </div>
        <span className={styles.artLabel}>PERPIX / CREATIVE SPACE</span>
      </div>
      <button
        type="button"
        className={styles.motionControl}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
        aria-label={t("pages.auth.login.visual.pauseMotion")}
      >
        {paused ? (
          <Play size={14} aria-hidden="true" />
        ) : (
          <Pause size={14} aria-hidden="true" />
        )}
        <span>
          {t(
            paused
              ? "pages.auth.login.visual.resumeMotion"
              : "pages.auth.login.visual.pauseMotion",
          )}
        </span>
      </button>
    </>
  );
}
