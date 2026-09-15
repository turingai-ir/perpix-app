import type { CSSProperties, FC } from "react";

import styles from "./generation-media-placeholder.module.css";

interface Props {
  label: string;
  aspectRatio?: string;
}

const normalizeAspectRatio = (value?: string) => {
  if (!value) return { css: "1 / 1", value: 1 };

  const pair = value.trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
  if (pair) {
    const width = Number(pair[1]);
    const height = Number(pair[2]);
    if (width > 0 && height > 0)
      return { css: `${width} / ${height}`, value: width / height };
  }

  const ratio = Number(value);
  return Number.isFinite(ratio) && ratio > 0
    ? { css: `${ratio} / 1`, value: ratio }
    : { css: "1 / 1", value: 1 };
};

const tiles = Array.from({ length: 12 });
const particles = Array.from({ length: 7 });

export const GenerationMediaPlaceholder: FC<Props> = ({
  label,
  aspectRatio,
}) => {
  const normalizedRatio = normalizeAspectRatio(aspectRatio);
  return (
    <div
      className={styles.root}
      role="status"
      aria-live="polite"
      style={{ "--media-ratio": normalizedRatio.value } as CSSProperties}
    >
      <p className={styles.label}>{label}</p>
      <div
        className={styles.viewport}
        style={{ aspectRatio: normalizedRatio.css }}
        aria-hidden="true"
      >
        <div className={styles.grid} />
        <div className={styles.particles}>
          {particles.map((_, index) => (
            <i key={index} />
          ))}
        </div>
        <div className={styles.frame}>
          <div className={styles.tiles}>
            {tiles.map((_, index) => (
              <i key={index} style={{ "--tile": index } as CSSProperties} />
            ))}
          </div>
          <div className={styles.scan} />
        </div>
        <div className={styles.horizon} />
      </div>
    </div>
  );
};
