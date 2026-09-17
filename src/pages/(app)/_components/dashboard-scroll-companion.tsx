import { useEffect, useRef } from "react";

import styles from "../dashboard.module.css";

export function DashboardScrollCompanion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    const viewport = root?.closest<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
    if (!root || !rail || !viewport) return;

    let frame = 0;
    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollRange = viewport.scrollHeight - viewport.clientHeight;
        const progress = scrollRange > 0 ? viewport.scrollTop / scrollRange : 0;
        const robotRange = Math.max(rail.clientHeight - 48, 0);

        root.style.setProperty("--scroll-progress", `${progress * 100}%`);
        root.style.setProperty("--robot-y", `${progress * robotRange}px`);
        root.dataset.scrollable = String(scrollRange > 16);
      });
    };

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(viewport);
    resizeObserver.observe(rail);
    viewport.addEventListener("scroll", updatePosition, { passive: true });
    updatePosition();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewport.removeEventListener("scroll", updatePosition);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.scrollCompanion}
      data-dashboard-scroll-companion
      aria-hidden="true"
    >
      <div ref={railRef} className={styles.companionRail}>
        <span className={styles.companionTrack} />
        <span className={styles.companionProgress} />
        <div className={styles.companionRobot}>
          <span className={styles.companionAntenna} />
          <span className={styles.companionEar} />
          <span className={styles.companionFace}>
            <img src="/android-chrome-192x192.png" alt="" />
            <i className={styles.companionEye} />
            <i className={styles.companionEye} />
            <b className={styles.companionSmile} />
          </span>
          <span className={styles.companionEar} />
          <span className={styles.companionBody}>
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
