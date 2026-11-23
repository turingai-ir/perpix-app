import { BadgeCheck, Sparkles } from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

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
      className="relative isolate overflow-hidden rounded-4xl bg-[linear-gradient(115deg,oklch(0.18_0.08_285),oklch(0.23_0.1_300)_52%,oklch(0.31_0.1_315))] text-night-foreground shadow-[0_24px_60px_-38px_oklch(0.35_0.15_295)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-night-foreground/13 after:content-['']"
      aria-labelledby="settings-title"
    >
      <div
        className="pointer-events-none absolute -top-52 left-[21%] size-96 rounded-full bg-[radial-gradient(circle,rgb(136_87_254/44%),transparent_70%)] blur-[3px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 -bottom-52 size-84 rounded-full bg-[radial-gradient(circle,rgb(217_100_233/36%),transparent_70%)] blur-[3px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklch,var(--night-foreground)_14%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--night-foreground)_14%,transparent)_1px,transparent_1px)] mask-[linear-gradient(90deg,transparent_15%,black_100%)] bg-size-[38px_38px] opacity-18"
        aria-hidden="true"
      />
      <div className="relative z-10 grid min-h-80 items-center gap-8 px-6 py-9 sm:px-10 lg:grid-cols-[1fr_360px] lg:px-14 lg:py-10 xl:grid-cols-[1fr_440px]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-night-foreground/20 bg-night-foreground/10 px-3.5 py-2 text-xs font-bold text-night-foreground backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-night-foreground/20">
            <Sparkles aria-hidden="true" className="size-4" />{" "}
            {t("pages.profile.settings.heroKicker")}
          </span>
          <h1
            id="settings-title"
            className="mt-5 text-3xl leading-tight font-black tracking-tight text-night-foreground sm:text-4xl"
          >
            {t("pages.profile.settings.heroTitle")}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-8 text-night-foreground/70 sm:text-base">
            {t("pages.profile.settings.heroDescription")}
          </p>
          <div className="mt-7 flex items-center gap-3 text-sm text-night-foreground/90">
            <span className="flex size-9 items-center justify-center rounded-full border border-night-foreground/30 bg-night-foreground/15 font-bold backdrop-blur-sm">
              {displayName.charAt(0)}
            </span>
            <span className="min-w-0 truncate font-medium">{displayName}</span>
            {user.is_verified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent-emerald/32 px-2.5 py-1 text-xs text-accent-emerald">
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
