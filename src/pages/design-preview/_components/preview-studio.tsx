import type { FC } from "react";
import { Image, SlidersHorizontal, Video } from "lucide-react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

const studioItems = [
  { icon: Image, title: "imageTitle", description: "imageDescription" },
  { icon: Video, title: "videoTitle", description: "videoDescription" },
  {
    icon: SlidersHorizontal,
    title: "editTitle",
    description: "editDescription",
  },
] as const;

const PreviewStudio: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <section
      id="studio"
      className="relative mx-auto w-full max-w-7xl px-5 pb-24 lg:px-8"
    >
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-violet-300">
          {t("pages.designPreview.studio.label")}
        </p>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          {t("pages.designPreview.studio.title")}
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {studioItems.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="group min-h-52 rounded-2xl border border-white/10 bg-white/[.035] p-6 transition-colors hover:border-violet-400/30 hover:bg-white/[.055]"
          >
            <div className="mb-12 flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-violet-300">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-medium">
              {t(`pages.designPreview.studio.${title}`)}
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              {t(`pages.designPreview.studio.${description}`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PreviewStudio;
