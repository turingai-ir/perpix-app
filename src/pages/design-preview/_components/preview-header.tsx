import type { FC } from "react";
import { Images } from "lucide-react";
import { Link } from "react-router";

import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

const PreviewHeader: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <header className="relative z-20 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
      <Link
        to={APP_ROUTES_KEY.app.path}
        className="flex min-h-12 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400"
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

      <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
        <a className="transition-colors hover:text-white" href="#studio">
          {t("pages.designPreview.nav.create")}
        </a>
        <a className="transition-colors hover:text-white" href="#models">
          {t("pages.designPreview.nav.models")}
        </a>
      </nav>

      <Link
        to={APP_ROUTES_KEY.gallery.path}
        className="hidden min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm transition-colors hover:bg-white/10 md:flex"
      >
        <Images className="size-4" aria-hidden="true" />
        {t("pages.designPreview.nav.gallery")}
      </Link>
      <Link
        to={APP_ROUTES_KEY.gallery.path}
        aria-label={t("pages.designPreview.nav.gallery")}
        className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
      >
        <Images className="size-5" aria-hidden="true" />
      </Link>
    </header>
  );
};

export default PreviewHeader;
