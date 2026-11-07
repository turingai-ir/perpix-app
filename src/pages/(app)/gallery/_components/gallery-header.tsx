import { ArrowUpLeft, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { DashboardBrandEntrance } from "../../_components/dashboard-brand-entrance";
import { GalleryOrbit } from "./gallery-orbit";

const pill =
  "min-h-11 rounded-full px-[1.15rem] transition-[color,background-color,border-color,transform] duration-140 ease-out-quint active:scale-[0.97] hover:-translate-y-px motion-reduce:duration-[0.01ms] motion-reduce:hover:transform-none";

export function GalleryHeader({
  refreshing,
  onRefresh,
}: {
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <header className="glass-blur border-glass-edge bg-glass contrast-more:border-foreground/44 relative isolate grid min-h-68 grid-cols-[minmax(0,1fr)_clamp(10rem,22vw,18rem)] items-center gap-[clamp(18px,4vw,56px)] overflow-hidden rounded-[clamp(24px,3vw,34px)] border bg-[linear-gradient(135deg,rgb(255_255_255/8%),transparent_38%)] p-[clamp(24px,4vw,52px)] shadow-[inset_0_1px_rgb(255_255_255/14%),0_28px_80px_-48px_color-mix(in_srgb,var(--foreground)_48%,transparent)] [--glass-blur:28px] [--glass-saturate:155%] after:pointer-events-none after:absolute after:inset-[auto_-8%_-72%_24%] after:-z-10 after:h-[125%] after:rounded-[50%] after:bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_68%)] after:content-[''] max-[430px]:grid-cols-1 max-md:min-h-0 max-md:grid-cols-[minmax(0,1fr)_5.5rem] max-md:gap-3 max-md:rounded-3xl max-md:p-5">
      <div className="relative z-2 max-w-176">
        <p className="border-primary/24 bg-primary/8 mb-4 inline-flex min-h-8 items-center gap-2 rounded-full border px-3 text-xs font-[650] text-[color-mix(in_srgb,var(--foreground)_76%,var(--primary))] max-md:mb-[0.65rem]">
          <Sparkles className="size-4" aria-hidden="true" />
          {t("pages.gallery.studio.eyebrow")}
        </p>
        <h1 className="max-w-[18ch] text-[clamp(2rem,4vw,3.75rem)] leading-[1.25] font-[730] tracking-[-0.035em] text-balance max-md:text-[clamp(1.65rem,8vw,2.2rem)] max-md:leading-[1.35]">
          {t("pages.gallery.studio.title")}
        </h1>
        <p className="text-foreground/66 mt-3 max-w-160 text-[clamp(0.9rem,1.5vw,1rem)] leading-[2] font-[450] text-pretty max-md:mt-2 max-md:line-clamp-2 max-md:text-[0.8125rem] max-md:leading-[1.85]">
          {t("pages.gallery.studio.description")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 max-[430px]:flex-nowrap max-md:mt-4">
          <Link
            to="/"
            className={cn(
              buttonVariants(),
              pill,
              "shadow-[inset_0_1px_rgb(255_255_255/20%),0_12px_36px_-18px_color-mix(in_srgb,var(--primary)_70%,transparent)] max-md:flex-1",
            )}
          >
            <span>{t("pages.gallery.studio.create")}</span>
            <ArrowUpLeft aria-hidden="true" className="ltr:rotate-90" />
          </Link>
          <Button
            variant="outline"
            className={cn(
              pill,
              "glass-blur border-glass-edge bg-background/58 [--glass-blur:12px] [--glass-saturate:100%] max-[430px]:w-11 max-[430px]:p-0 max-md:px-[0.85rem] max-[430px]:[&_span]:hidden",
            )}
            aria-label={t("pages.gallery.actions.refresh")}
            disabled={refreshing}
            onClick={onRefresh}
          >
            <RefreshCw
              aria-hidden="true"
              className={refreshing ? "motion-safe:animate-spin" : ""}
            />
            <span>{t("pages.gallery.actions.refresh")}</span>
          </Button>
        </div>
      </div>
      <div className="relative z-1 w-full max-w-68 justify-self-center max-[430px]:hidden max-md:w-22 max-md:self-start [&_[data-brand-entrance]]:max-w-full">
        <DashboardBrandEntrance />
      </div>
      <GalleryOrbit />
    </header>
  );
}
