import { useAppTranslate } from "@/shared/hooks";
import { VideoBrandCinema } from "./brand-cinema";

export function VideoGenerationPortal({
  aspectRatio,
}: {
  aspectRatio: string;
}) {
  const { t } = useAppTranslate();

  return (
    <section
      className="relative w-full min-w-0 animate-portal-enter overflow-hidden rounded-xl border border-border bg-background shadow-modal inset-shadow-highlight-sm motion-reduce:animate-none sm:rounded-2xl"
      data-video-generation-portal
      aria-label={t("pages.generation.video.generationLoading.content")}
    >
      <VideoBrandCinema rendering aspectRatio={aspectRatio} />
      <div
        className="relative min-w-0 border-t border-border px-5 pt-4.5 pb-5.5 sm:px-6 sm:pt-5 sm:pb-6"
        role="status"
        aria-live="polite"
      >
        <strong className="mt-1.5 block text-[clamp(1.2rem,3vw,1.45rem)] leading-normal">
          {t("pages.generation.video.studio.renderingTitle")}
        </strong>
        <p className="mt-1.5 text-subhead leading-[1.8] text-muted-foreground">
          {t("pages.generation.video.studio.renderingHint")}
        </p>
      </div>
    </section>
  );
}
