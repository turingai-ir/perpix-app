import type { FC } from "react";
import { Images } from "lucide-react";
import { Link } from "react-router";

import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { APP_I18_KEYS } from "@/shared/i18n";

const PreviewHeader: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <header className="relative z-20 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
      <Link
        to={APP_ROUTES_KEY.app.path}
        className="focus-visible:outline-primary flex min-h-12 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <img
          src="/android-chrome-192x192.png"
          alt=""
          aria-hidden="true"
          className="size-10 rounded-xl object-cover"
        />
        <span className="text-lg font-semibold tracking-tight">
          {t("pages.designPreview.brand")}
        </span>
      </Link>

      <nav className="text-muted-foreground hidden items-center gap-8 text-sm md:flex">
        <a className="hover:text-foreground transition-colors" href="#studio">
          {t("pages.designPreview.nav.create")}
        </a>
        <a className="hover:text-foreground transition-colors" href="#models">
          {t("pages.designPreview.nav.models")}
        </a>
      </nav>

      <Link
        to={APP_ROUTES_KEY.gallery.path}
        className="border-border bg-foreground/5 hover:bg-foreground/10 hidden min-h-11 items-center gap-2 rounded-xl border px-4 text-sm transition-colors md:flex"
      >
        <Images className="size-4" aria-hidden="true" />
        {t("pages.designPreview.nav.gallery")}
      </Link>
      <Link
        to={APP_ROUTES_KEY.gallery.path}
        aria-label={t("pages.designPreview.nav.gallery")}
        className="border-border bg-foreground/5 flex size-12 items-center justify-center rounded-xl border md:hidden"
      >
        <Images className="size-5" aria-hidden="true" />
      </Link>
    </header>
  );
};

export default PreviewHeader;
