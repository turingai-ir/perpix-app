import { useState } from "react";

import { BootSlogan } from "./boot-slogan";
import styles from "./boot-office.module.css";

const scenes = ["office", "turing", "tesla"] as const;

export function BootOffice() {
  const [scene] = useState(
    () => scenes[Math.floor(Math.random() * scenes.length)],
  );
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={styles.camera}
      aria-hidden="true"
      data-loaded={loaded}
      data-scene={scene}
    >
      <div className={styles.room}>
        <img
          src={`/images/boot/${scene}.webp`}
          width={1536}
          height={1024}
          alt=""
          fetchPriority="high"
          className={styles.photograph}
          onLoad={() => setLoaded(true)}
        />
        <div className={styles.screen} data-office-screen>
          <img
            src="/images/boot/dashboard.webp"
            width={1440}
            height={1000}
            alt=""
            fetchPriority="high"
          />
        </div>
        <BootSlogan />
      </div>
    </div>
  );
}
