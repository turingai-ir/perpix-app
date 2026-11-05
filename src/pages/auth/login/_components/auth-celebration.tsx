import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "../login.module.css";

gsap.registerPlugin(useGSAP);

export default function AuthCelebration() {
  const scope = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const messages = [
    t("pages.auth.login.visual.loadingStart"),
    t("pages.auth.login.visual.loadingMiddle"),
    t("pages.auth.login.visual.loadingReady"),
  ];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPhase(2);
        return;
      }

      gsap
        .timeline()
        .fromTo(
          "[data-celebration-panel]",
          { opacity: 0, y: 28, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
        )
        .fromTo(
          "[data-celebration-logo]",
          { opacity: 0, y: -48, rotation: -14, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            rotation: 5,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.5)",
          },
          0.16,
        )
        .fromTo(
          "[data-celebration-orbit]",
          { opacity: 0, scale: 0.72, rotation: -30 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          0.2,
        )
        .call(() => setPhase(1), undefined, 1.65)
        .call(() => setPhase(2), undefined, 3.4);
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className={styles.celebration}
      data-auth-celebration
      role="status"
      aria-live="polite"
    >
      <div className={styles.celebrationPanel} data-celebration-panel>
        <span className={styles.celebrationEyebrow}>
          {t("pages.auth.login.visual.loadingEyebrow")}
        </span>
        <div
          className={styles.celebrationOrbit}
          data-celebration-orbit
          aria-hidden="true"
        >
          <span className={styles.celebrationLogo} data-celebration-logo />
          <span className={styles.celebrationSpark}>✦</span>
        </div>
        <p className={styles.celebrationMessage} key={phase}>
          {messages[phase]}
        </p>
        <div className={styles.celebrationProgress} aria-hidden="true">
          <span />
        </div>
        <span className={styles.celebrationSignature} aria-hidden="true">
          PERPIX / STUDIO
        </span>
      </div>
    </div>
  );
}
