import type { FC } from "react";
import { Image, SlidersHorizontal, Video } from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

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
        <p className="text-primary mb-2 text-sm font-medium">
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
            className="group border-border bg-card hover:border-primary/30 hover:bg-muted min-h-52 rounded-2xl border p-6 transition-colors"
          >
            <div className="border-border bg-foreground/5 text-primary mb-12 flex size-11 items-center justify-center rounded-xl border">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-medium">
              {t(`pages.designPreview.studio.${title}`)}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-7">
              {t(`pages.designPreview.studio.${description}`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PreviewStudio;
