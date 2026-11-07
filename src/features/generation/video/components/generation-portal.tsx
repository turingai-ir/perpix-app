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
      className="animate-portal-enter border-border bg-background relative w-full min-w-0 overflow-hidden rounded-[18px] border shadow-[inset_0_1px_rgb(255_255_255/7%),0_20px_55px_rgb(0_0_0/24%)] motion-reduce:animate-none sm:rounded-[20px]"
      data-video-generation-portal
      aria-label={t("pages.generation.video.generationLoading.content")}
    >
      <VideoBrandCinema rendering aspectRatio={aspectRatio} />
      <div
        className="border-border relative min-w-0 border-t px-5 pt-4.5 pb-5.5 sm:px-6 sm:pt-5 sm:pb-6"
        role="status"
        aria-live="polite"
      >
        <strong className="mt-1.5 block text-[clamp(1.2rem,3vw,1.45rem)] leading-normal">
          {t("pages.generation.video.studio.renderingTitle")}
        </strong>
        <p className="text-muted-foreground mt-1.5 text-[13px] leading-[1.8]">
          {t("pages.generation.video.studio.renderingHint")}
        </p>
      </div>
    </section>
  );
}
