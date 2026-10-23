import { BadgeCheck, Sparkles } from "lucide-react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

import { IdentityCard } from "./identity-card";

type IdentityHeroProps = {
  user: {
    name: string | null;
    phone_number: string;
    is_verified: boolean;
    created_at: string;
  };
};

export function IdentityHero({ user }: IdentityHeroProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const displayName = user.name?.trim() || t("pages.profile.settings.unnamed");

  return (
    <section
      className="settings-hero relative isolate overflow-hidden rounded-[2rem]"
      aria-labelledby="settings-title"
    >
      <div
        className="settings-hero-orb settings-hero-orb-one"
        aria-hidden="true"
      />
      <div
        className="settings-hero-orb settings-hero-orb-two"
        aria-hidden="true"
      />
      <div className="settings-hero-grid" aria-hidden="true" />
      <div className="relative z-10 grid min-h-80 items-center gap-8 px-6 py-9 sm:px-10 lg:grid-cols-[1fr_360px] lg:px-14 lg:py-10 xl:grid-cols-[1fr_440px]">
        <div className="settings-hero-copy">
          <span className="settings-hero-kicker">
            <Sparkles aria-hidden="true" className="size-4" />{" "}
            {t("pages.profile.settings.heroKicker")}
          </span>
          <h1
            id="settings-title"
            className="mt-5 text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl"
          >
            {t("pages.profile.settings.heroTitle")}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-8 text-white/70 sm:text-base">
            {t("pages.profile.settings.heroDescription")}
          </p>
          <div className="mt-7 flex items-center gap-3 text-sm text-white/90">
            <span className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/15 font-bold backdrop-blur-sm">
              {displayName.charAt(0)}
            </span>
            <span className="min-w-0 truncate font-medium">{displayName}</span>
            {user.is_verified && (
              <span className="settings-verified">
                <BadgeCheck aria-hidden="true" className="size-4" />
                {t("pages.profile.settings.verified")}
              </span>
            )}
          </div>
        </div>
        <IdentityCard user={user} displayName={displayName} />
      </div>
    </section>
  );
}
