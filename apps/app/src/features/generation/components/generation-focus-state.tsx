import {
  Check,
  Clapperboard,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";

export type GenerationFocusPhase = "submitting" | "queued" | "processing";

const phases: GenerationFocusPhase[] = ["submitting", "queued", "processing"];

const stepToneClassName =
  "text-primary [&_[data-step-marker]]:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))] [&_[data-step-marker]]:bg-[color-mix(in_srgb,var(--primary)_10%,var(--card))]";

function getStepClassName(index: number, activeIndex: number) {
  if (index <= activeIndex) return stepToneClassName;
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
      className="mx-auto mb-2.5 grid w-[calc(100%-1rem)] animate-reveal grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,var(--border))] bg-card px-4 py-3.5 motion-reduce:animate-none"
      data-media={media}
      role="status"
      aria-live="polite"
    >
      <div
        className="grid size-10 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_12%,var(--card))] text-primary [&_svg]:block [&_svg]:size-5"
        aria-hidden="true"
      >
        {media === "video" ? <Clapperboard /> : <Sparkles />}
      </div>
      <div className="min-w-0">
        <strong className="block text-sm leading-relaxed text-foreground">
          {t(`${translationKey}.${phase}`)}
        </strong>
        <span className="mt-1 flex items-baseline gap-1.5 text-xs leading-[1.8] text-muted-foreground [&_svg]:mt-1 [&_svg]:size-3.5 [&_svg]:flex-none [&_svg]:self-start">
          <LockKeyhole aria-hidden="true" />
          {t(`${translationKey}.lockedHint`)}
        </span>
      </div>
      <ol
        className="col-span-full mt-1.5 grid grid-cols-3 p-0 text-caption text-muted-foreground"
        aria-label={t(`${translationKey}.progressLabel`)}
      >
        {phases.map((item, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;
          return (
            <li
              key={item}
              className={cn(
                "relative flex min-w-0 flex-col items-center gap-1.5 after:absolute after:start-[calc(50%+1rem)] after:top-4 after:h-px after:w-[calc(100%-2rem)] after:bg-border after:content-[''] last:after:hidden",
                getStepClassName(index, activeIndex),
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                data-step-marker
                className="relative z-[1] grid size-8 place-items-center rounded-full border border-border bg-card tabular-nums [&_svg]:block [&_svg]:size-4"
                aria-hidden="true"
              >
                {isComplete ? <Check /> : null}
                {isActive ? (
                  <LoaderCircle className="animate-spin motion-reduce:animate-none" />
                ) : null}
                {!isComplete && !isActive ? index + 1 : null}
              </span>
              <span className="text-center leading-[1.7] text-balance">
                {t(`${translationKey}.steps.${item}`)}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
