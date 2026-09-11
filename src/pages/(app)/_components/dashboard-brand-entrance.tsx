import { useState } from "react";

import styles from "../dashboard.module.css";

const BRAND_ENTRANCES = ["thunder", "rift", "forge"] as const;

export function DashboardBrandEntrance() {
  const [entrance] = useState(
    () => BRAND_ENTRANCES[Math.floor(Math.random() * BRAND_ENTRANCES.length)],
  );

  return (
    <div
      className={styles.brandObject}
      data-brand-entrance={entrance}
      aria-hidden="true"
    >
      <div className={styles.brandAura} />
      <div className={styles.brandRift}>
        <i />
        <i />
      </div>
      <svg className={styles.brandLightning} viewBox="0 0 512 512">
        <path d="M38 176 101 133 77 101 157 38 191 80 248 19" />
        <path d="m474 178-61-47 23-35-72-51-35 42-58-64" />
        <path d="m249 4-30 91 42-13-35 100 81-102-43 16 32-92" />
      </svg>
      <div className={styles.brandPlinth} />
      <div className={styles.brandFace}>
        <img
          className={styles.brandImage}
          src="/android-chrome-512x512.png"
          width={512}
          height={512}
          alt=""
          draggable={false}
        />
        <i className={`${styles.brandEcho} ${styles.brandEchoMagenta}`} />
        <i className={`${styles.brandEcho} ${styles.brandEchoCyan}`} />
        <i className={styles.brandScan} />
        <div className={styles.brandShards}>
          {Array.from({ length: 6 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
