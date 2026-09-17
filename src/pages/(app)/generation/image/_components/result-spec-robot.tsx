import { useAppTranslate } from "@/hooks";
import styles from "./result-card.module.css";

export function ResultSpecRobot({
  ratio,
  resolution,
}: {
  ratio: string;
  resolution?: unknown;
}) {
  const { t } = useAppTranslate();

  return (
    <aside
      className={styles.robotScene}
      aria-label={t("pages.generation.image.studio.optionalSettings")}
    >
      <div className={styles.robotShadow} aria-hidden="true" />
      <div className={styles.robotRig}>
        <span className={styles.antenna} aria-hidden="true">
          <i />
        </span>
        <div className={styles.robotHead} aria-hidden="true">
          <span className={styles.robotEar} />
          <img src="/android-chrome-512x512.png" alt="" />
          <span className={styles.robotFace}>
            <i />
            <i />
            <b />
            <em />
            <em />
          </span>
          <span className={styles.robotEar} />
        </div>
        <div className={styles.robotBody}>
          <span
            className={`${styles.robotArm} ${styles.robotArmStart}`}
            aria-hidden="true"
          >
            <i />
          </span>
          <dl className={styles.robotScreen}>
            <div>
              <dt className="sr-only">
                {t("pages.generation.image.studio.fields.aspect_ratio")}
              </dt>
              <dd dir="ltr">{ratio}</dd>
            </div>
            {resolution ? (
              <div>
                <dt className="sr-only">
                  {t("pages.generation.image.studio.fields.resolution")}
                </dt>
                <dd dir="ltr">{String(resolution)}</dd>
              </div>
            ) : null}
          </dl>
          <span
            className={`${styles.robotArm} ${styles.robotArmEnd}`}
            aria-hidden="true"
          >
            <i />
          </span>
        </div>
      </div>
    </aside>
  );
}
