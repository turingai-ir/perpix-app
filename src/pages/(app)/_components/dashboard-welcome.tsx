import { Image, Sparkles, Video } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

interface DashboardWelcomeProps {
  isVerified: boolean;
  userName: string | null;
}

export function DashboardWelcome({
  isVerified,
  userName,
}: DashboardWelcomeProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const displayName = userName || t("pages.root.dashboard.welcome.defaultName");

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#101116] p-5 sm:p-7">
      <div className="pointer-events-none absolute -start-20 -top-24 h-64 w-64 rounded-full bg-fuchsia-600/15 blur-3xl" />
      <div className="pointer-events-none absolute end-10 -bottom-32 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 sm:flex">
            <img
              src="/android-chrome-192x192.png"
              alt={t("pages.root.dashboard.logoAlt")}
              className="h-10 w-10"
            />
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-fuchsia-300">
                {t("pages.root.dashboard.welcome.eyebrow")}
              </span>
              {isVerified ? (
                <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                  {t("pages.root.dashboard.account.verified")}
                </Badge>
              ) : null}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {t("pages.root.dashboard.welcome.title", { name: displayName })}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              {t("pages.root.dashboard.welcome.description")}
            </p>
          </div>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3">
          <Link
            data-dashboard-primary-action
            to={APP_ROUTES_KEY.generation.image.path}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-4 font-semibold text-black transition hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Image className="h-5 w-5" />
            {t("pages.root.dashboard.actions.image")}
          </Link>
          <Link
            data-dashboard-primary-action
            to={APP_ROUTES_KEY.generation.video.path}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
          >
            <Video className="h-5 w-5" />
            {t("pages.root.dashboard.actions.video")}
          </Link>
        </div>
      </div>
      <Sparkles className="pointer-events-none absolute start-5 bottom-5 h-4 w-4 text-fuchsia-400/40" />
    </section>
  );
}
