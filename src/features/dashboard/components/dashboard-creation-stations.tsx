import { ArrowUpLeft, Image, ShieldCheck, Video } from "lucide-react";

import { DashboardBrandEntrance } from "./dashboard-brand-entrance";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

export type CreativeMode = "image" | "video";

const CARD_CLASS = [
  "group relative grid min-h-60 min-w-0 animate-card-arrival grid-cols-[auto_minmax(0,1fr)] content-start gap-4 overflow-hidden rounded-3xl p-4 text-start text-foreground sm:min-h-68 sm:p-5.5",
  "[--choice-accent:var(--image-accent)] data-[mode=video]:[--choice-accent:var(--video-accent)] data-[mode=video]:[animation-delay:70ms]",
  "glass-blur [--glass-blur:18px] [--glass-saturate:135%] border border-[color-mix(in_srgb,var(--choice-accent)_30%,var(--glass-border))] bg-(--glass-surface) bg-[radial-gradient(circle_at_100%_0%,color-mix(in_srgb,var(--choice-accent)_12%,transparent),transparent_46%),linear-gradient(145deg,var(--glass-highlight),transparent_38%)] shadow-[inset_0_1px_rgb(255_255_255/13%),inset_0_-1px_rgb(255_255_255/3%),0_22px_52px_-34px_rgb(0_0_0/76%)]",
  "transition-[transform,border-color,box-shadow,background-color] duration-200 ease-out-quint",
  "after:pointer-events-none after:absolute after:-right-[15%] after:-bottom-[55%] after:left-[30%] after:h-44 after:rounded-full after:bg-[color-mix(in_srgb,var(--choice-accent)_12%,transparent)] after:blur-[45px] after:content-[''] in-data-[fx=lite]:after:blur-none",
  "hover-capable:hover:-translate-y-0.75 hover-capable:hover:border-[color-mix(in_srgb,var(--choice-accent)_52%,transparent)] hover-capable:hover:shadow-[inset_0_1px_rgb(255_255_255/14%),0_26px_58px_-38px_color-mix(in_srgb,var(--choice-accent)_38%,transparent)]",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring in-data-[fx=lite]:bg-(--glass-surface-strong) in-data-[fx=lite]:backdrop-filter-none!",
  "motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0",
].join(" ");

interface DashboardCreationStationsProps {
  onEnter: (mode: CreativeMode) => void;
}

export function DashboardCreationStations({
  onEnter,
}: DashboardCreationStationsProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <section
      className="relative z-1 grid gap-6"
      aria-labelledby="creation-choice-title"
    >
      <div className="grid grid-cols-1 items-center gap-5 pt-1 min-[541px]:grid-cols-[minmax(0,1fr)_clamp(11rem,23vw,16rem)] min-[541px]:gap-[clamp(1.5rem,4vw,4rem)] min-[541px]:pt-2 min-[541px]:pb-4">
        <div className="max-w-176 min-w-0 text-center min-[541px]:text-start">
          <span className="text-xs font-semibold text-(--image-accent)">
            {t("pages.root.dashboard.choice.eyebrow")}
          </span>
          <h1
            id="creation-choice-title"
            className="text-foreground mt-1.5 text-[clamp(2rem,4vw,3.35rem)] font-bold tracking-tighter"
          >
            {t("pages.root.dashboard.choice.title")}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-loose">
            {t("pages.root.dashboard.choice.description")}
          </p>
        </div>
        <DashboardBrandEntrance />
      </div>
      <div className="grid grid-cols-1 gap-4 min-[541px]:grid-cols-2">
        {(["image", "video"] as const).map((mode) => {
          const Icon = mode === "image" ? Image : Video;
          const examples = t(`pages.root.dashboard.choice.${mode}.examples`, {
            returnObjects: true,
          }) as string[];
          return (
            <button
              key={mode}
              type="button"
              className={CARD_CLASS}
              data-mode={mode}
              data-dashboard-primary-action
              onClick={() => onEnter(mode)}
            >
              <span
                className="grid size-13 place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--choice-accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--choice-accent)_12%,transparent)] text-(--choice-accent) shadow-[0_0_28px_color-mix(in_srgb,var(--choice-accent)_10%,transparent)] [&_svg]:size-6"
                aria-hidden="true"
              >
                <Icon />
              </span>
              <span className="min-w-0">
                <strong className="block text-xl font-bold">
                  {t(`pages.root.dashboard.choice.${mode}.title`)}
                </strong>
                <small className="text-muted-foreground mt-1.5 block text-[0.78rem] leading-relaxed">
                  {t(`pages.root.dashboard.choice.${mode}.description`)}
                </small>
              </span>
              <span
                className="z-1 col-span-full flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 min-[541px]:flex-wrap min-[541px]:overflow-visible min-[541px]:pb-0 [&::-webkit-scrollbar]:hidden"
                aria-hidden="true"
              >
                {examples.map((example) => (
                  <i
                    key={example}
                    className="border-foreground/8 bg-foreground/5 text-foreground/80 rounded-full border px-2.5 py-1.5 text-xs whitespace-nowrap not-italic shadow-[inset_0_1px_rgb(255_255_255/6%)]"
                  >
                    {example}
                  </i>
                ))}
              </span>
              <span className="text-foreground z-1 col-span-full mt-auto flex min-h-13 items-center justify-between gap-3 rounded-[0.9rem] bg-linear-135 from-[color-mix(in_srgb,var(--choice-accent)_28%,transparent)] to-[color-mix(in_srgb,var(--choice-accent)_15%,transparent)] px-4 text-[0.9rem] font-bold shadow-[inset_0_1px_rgb(255_255_255/13%),inset_0_0_0_1px_color-mix(in_srgb,var(--choice-accent)_18%,transparent)]">
                {t(`pages.root.dashboard.choice.${mode}.action`)}
                <ArrowUpLeft
                  aria-hidden="true"
                  className="hover-capable:group-hover:-translate-x-0.75 hover-capable:group-hover:translate-y-0.75 size-4.5 transition-transform duration-200 motion-reduce:transition-none"
                />
              </span>
              <span className="text-muted-foreground z-1 col-span-full flex items-center gap-1.5 text-xs leading-relaxed">
                <ShieldCheck
                  aria-hidden="true"
                  className="text-accent-emerald size-3.5 flex-none"
                />
                {t("pages.root.dashboard.choice.trust")}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
