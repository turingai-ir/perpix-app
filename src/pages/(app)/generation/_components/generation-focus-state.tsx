import {
  Check,
  Clapperboard,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { useAppTranslate } from "@/hooks";
import styles from "./generation-focus-state.module.css";

export type GenerationFocusPhase = "submitting" | "queued" | "processing";

const phases: GenerationFocusPhase[] = ["submitting", "queued", "processing"];

function getStepClassName(index: number, activeIndex: number) {
  if (index === activeIndex) return styles.active;
  if (index < activeIndex) return styles.complete;
  return undefined;
}

export function GenerationFocusState({
  phase,
  media = "image",
}: {
  phase: GenerationFocusPhase;
  media?: "image" | "video";
}) {
  const { t } = useAppTranslate();
  const activeIndex = phases.indexOf(phase);
  const translationKey = `pages.generation.${media}.focus`;

  return (
    <section
      className={styles.shell}
      data-media={media}
      role="status"
      aria-live="polite"
    >
      <div className={styles.orb} aria-hidden="true">
        <span />
        {media === "video" ? <Clapperboard /> : <Sparkles />}
      </div>
      <div className={styles.copy}>
        <strong>{t(`${translationKey}.${phase}`)}</strong>
        <span className={styles.hint}>
          <LockKeyhole aria-hidden="true" />
          {t(`${translationKey}.lockedHint`)}
        </span>
        <ol
          className={styles.steps}
          aria-label={t(`${translationKey}.progressLabel`)}
        >
          {phases.map((item, index) => {
            const isComplete = index < activeIndex;
            const isActive = index === activeIndex;
            return (
              <li
                key={item}
                className={getStepClassName(index, activeIndex)}
                aria-current={isActive ? "step" : undefined}
              >
                <span>
                  {isComplete ? <Check /> : null}
                  {isActive ? <LoaderCircle /> : null}
                  {!isComplete && !isActive ? index + 1 : null}
                </span>
                {t(`${translationKey}.steps.${item}`)}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
