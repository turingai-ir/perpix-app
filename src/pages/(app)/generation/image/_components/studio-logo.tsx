import type { CSSProperties } from "react";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "../studio.module.css";

const nodes = [
  [7, 37],
  [18, 18],
  [24, 66],
  [37, 30],
  [41, 76],
  [59, 23],
  [62, 67],
  [76, 38],
  [84, 71],
  [94, 26],
] as const;
const links = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [3, 6],
  [4, 6],
  [5, 6],
  [5, 7],
  [6, 7],
  [6, 8],
  [7, 8],
  [7, 9],
] as const;

export default function StudioLogo() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div className={styles.logoSection}>
      <div className={styles.neuralStage} data-testid="studio-logo">
        <div className={styles.vaults} aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <i key={index} style={{ "--vault": index } as CSSProperties} />
          ))}
        </div>
        <svg
          className={styles.neuralLinks}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {links.map(([from, to], index) => (
            <line
              key={`${from}-${to}`}
              x1={nodes[from][0]}
              y1={nodes[from][1]}
              x2={nodes[to][0]}
              y2={nodes[to][1]}
              style={{ "--link": index } as CSSProperties}
            />
          ))}
        </svg>
        <div className={styles.previewNodes} aria-hidden="true">
          {nodes.map(([left, top], index) => (
            <i
              key={`${left}-${top}`}
              style={
                {
                  "--node": index,
                  "--left": `${left}%`,
                  "--top": `${top}%`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className={styles.neuralCore}>
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <img
            src="/android-chrome-512x512.png"
            alt={t("pages.designPreview.logoAlt")}
            className={styles.logo}
          />
        </div>
        <span className={styles.previewScan} aria-hidden="true" />
      </div>
    </div>
  );
}
