import { ArrowUpLeft, Image, ShieldCheck, Video } from "lucide-react";
import { useState } from "react";

import type { CreativeMode } from "./dashboard-creative-presets";
import styles from "../dashboard.module.css";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface DashboardCreationStationsProps {
  onEnter: (mode: CreativeMode) => void;
}

export function DashboardCreationStations({
  onEnter,
}: DashboardCreationStationsProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [brandEntrance] = useState(
    () =>
      (["lift", "turn", "material"] as const)[Math.floor(Math.random() * 3)],
  );

  return (
    <section
      className={styles.choiceSection}
      aria-labelledby="creation-choice-title"
    >
      <div className={styles.choiceHeader}>
        <div className={styles.choiceHeading}>
          <span>{t("pages.root.dashboard.choice.eyebrow")}</span>
          <h1 id="creation-choice-title">
            {t("pages.root.dashboard.choice.title")}
          </h1>
          <p>{t("pages.root.dashboard.choice.description")}</p>
        </div>
        <div
          className={styles.brandObject}
          data-brand-entrance={brandEntrance}
          aria-hidden="true"
        >
          <div className={styles.brandPlinth} />
          <div className={styles.brandFace}>
            <img
              src="/android-chrome-512x512.png"
              width={512}
              height={512}
              alt=""
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div className={styles.choiceGrid}>
        {(["image", "video"] as const).map((mode) => {
          const Icon = mode === "image" ? Image : Video;
          const examples = t(`pages.root.dashboard.choice.${mode}.examples`, {
            returnObjects: true,
          }) as string[];
          return (
            <button
              key={mode}
              type="button"
              className={styles.choiceCard}
              data-mode={mode}
              data-dashboard-primary-action
              onClick={() => onEnter(mode)}
            >
              <span className={styles.choiceIcon} aria-hidden="true">
                <Icon />
              </span>
              <span className={styles.choiceCopy}>
                <strong>
                  {t(`pages.root.dashboard.choice.${mode}.title`)}
                </strong>
                <small>
                  {t(`pages.root.dashboard.choice.${mode}.description`)}
                </small>
              </span>
              <span className={styles.choiceExamples} aria-hidden="true">
                {examples.map((example) => (
                  <i key={example}>{example}</i>
                ))}
              </span>
              <span className={styles.choiceAction}>
                {t(`pages.root.dashboard.choice.${mode}.action`)}
                <ArrowUpLeft aria-hidden="true" />
              </span>
              <span className={styles.choiceTrust}>
                <ShieldCheck aria-hidden="true" />
                {t("pages.root.dashboard.choice.trust")}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
