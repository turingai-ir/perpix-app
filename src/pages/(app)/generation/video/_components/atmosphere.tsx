import type { CSSProperties } from "react";

import styles from "../studio.module.css";

const nodes = [
  [12, 18, 0],
  [82, 14, 1],
  [68, 34, 2],
  [22, 52, 3],
  [88, 66, 4],
  [42, 76, 5],
  [8, 86, 6],
  [72, 92, 7],
] as const;

export function VideoAtmosphere({ subdued = false }: { subdued?: boolean }) {
  return (
    <div
      className={`${styles.atmosphere} ${subdued ? styles.subdued : ""}`}
      aria-hidden="true"
    >
      <div className={styles.aurora} />
      <div className={styles.perspectiveGrid} />
      <div className={styles.lightBeam} />
      {nodes.map(([x, y, delay]) => (
        <i
          key={`${x}-${y}`}
          style={
            {
              "--node-x": `${x}%`,
              "--node-y": `${y}%`,
              "--node-delay": `${delay * -0.37}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
