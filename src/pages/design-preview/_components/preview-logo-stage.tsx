import type { FC } from "react";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

const PreviewLogoStage: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div
      id="models"
      className="relative isolate mx-auto grid aspect-square w-full max-w-lg place-items-center"
    >
      <div className="absolute aspect-square w-2/3 rounded-full bg-[conic-gradient(from_210deg,var(--image-accent),var(--primary),var(--video-accent),var(--image-accent))] opacity-30 blur-[54px]" aria-hidden="true" />
      <div className="absolute aspect-square w-[82%] rounded-full border border-foreground/15 shadow-[inset_0_0_70px] shadow-primary/10" aria-hidden="true" />
      <img
        src="/android-chrome-512x512.png"
        alt={t("pages.designPreview.logoAlt")}
        className="animate-float motion-reduce:animate-none relative z-[2] w-[58%] rounded-[28%] mix-blend-screen drop-shadow-[0_28px_50px_color-mix(in_srgb,var(--primary)_25%,transparent)]"
      />
      <span className="absolute z-[3] flex min-h-9 items-center gap-2 rounded-xl border border-foreground/10 bg-card/80 px-2.5 text-[11px] text-foreground/80 shadow-[0_18px_60px] shadow-black/35 backdrop-blur-lg sm:min-h-10 sm:px-3.5 sm:text-xs end-0 top-[17%] sm:end-[2%]">
        <i aria-hidden="true" className="size-2 rounded-full bg-fuchsia-400" />
        {t("pages.designPreview.hero.modelOne")}
      </span>
      <span className="absolute z-[3] flex min-h-9 items-center gap-2 rounded-xl border border-foreground/10 bg-card/80 px-2.5 text-[11px] text-foreground/80 shadow-[0_18px_60px] shadow-black/35 backdrop-blur-lg sm:min-h-10 sm:px-3.5 sm:text-xs start-0 bottom-[20%]">
        <i aria-hidden="true" className="size-2 rounded-full bg-sky-400" />
        {t("pages.designPreview.hero.modelTwo")}
      </span>
      <span className="absolute z-[3] flex min-h-9 items-center gap-2 rounded-xl border border-foreground/10 bg-card/80 px-2.5 text-[11px] text-foreground/80 shadow-[0_18px_60px] shadow-black/35 backdrop-blur-lg sm:min-h-10 sm:px-3.5 sm:text-xs end-[18%] bottom-[8%]">
        <i aria-hidden="true" className="size-2 rounded-full bg-violet-400" />
        {t("pages.designPreview.hero.modelThree")}
      </span>
    </div>
  );
};

export default PreviewLogoStage;
