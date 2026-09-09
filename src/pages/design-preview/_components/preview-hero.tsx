import type { FC } from "react";
import { ArrowLeft, Image, Play, Sparkles } from "lucide-react";
import { Link } from "react-router";

import PreviewLogoStage from "./preview-logo-stage";

import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

const PreviewHero: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <section className="relative mx-auto grid min-h-[690px] w-full max-w-7xl items-center gap-8 px-5 pt-10 pb-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-16">
      <div className="relative z-10 order-2 max-w-2xl lg:order-1">
        <div className="mb-6 inline-flex min-h-9 items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 text-sm text-violet-200">
          <Sparkles className="size-4" aria-hidden="true" />
          {t("pages.designPreview.hero.eyebrow")}
        </div>
        <h1 className="text-4xl leading-[1.25] font-semibold tracking-tight text-balance sm:text-5xl lg:text-7xl">
          {t("pages.designPreview.hero.title")}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
          {t("pages.designPreview.hero.description")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            data-preview-action
            to={APP_ROUTES_KEY.generation.image.path}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-fuchsia-500 to-violet-600 px-6 font-medium shadow-[0_12px_40px_-14px_rgba(192,38,211,.9)] transition-opacity hover:opacity-90"
          >
            <Image className="size-5" aria-hidden="true" />
            {t("pages.designPreview.hero.imageAction")}
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
          <Link
            data-preview-action
            to={APP_ROUTES_KEY.generation.video.path}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 font-medium transition-colors hover:bg-white/[.08]"
          >
            <Play className="size-5" aria-hidden="true" />
            {t("pages.designPreview.hero.videoAction")}
          </Link>
        </div>
        <p className="mt-5 text-sm text-slate-500">
          {t("pages.designPreview.hero.trust")}
        </p>
      </div>
      <div className="order-1 lg:order-2">
        <PreviewLogoStage />
      </div>
    </section>
  );
};

export default PreviewHero;
