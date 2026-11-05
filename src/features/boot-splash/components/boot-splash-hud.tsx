import { cn } from "@/lib/utils";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

const chrome =
  "bg-[linear-gradient(180deg,#ffffff_0%,#f3d9ff_38%,#e02bd6_48%,#8b3df0_62%,#2d7bff_80%,#35c8ff_100%)] bg-clip-text text-transparent";

/** Fighting-game title card over the scene, in the logo's colour spectrum. */
export function BootSplashHud({
  leaving,
  fighting,
}: {
  leaving: boolean;
  /** "VS" only belongs between the fighters, not over the slogan. */
  fighting: boolean;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex flex-col items-center justify-between py-[8vh] transition-opacity duration-200",
        leaving && "opacity-0",
      )}
    >
      <p
        dir="ltr"
        aria-hidden="true"
        className={cn(
          chrome,
          "-skew-x-6 text-[clamp(2.75rem,11vw,7.5rem)] leading-none font-black tracking-[0.06em] drop-shadow-[0_0_24px_rgb(139_61_240/55%)]",
        )}
      >
        {t("features.bootSplash.brand")}
      </p>
      <p
        dir="ltr"
        aria-hidden="true"
        className={cn(
          "transition-opacity duration-500",
          !fighting && "opacity-0",
        )}
      >
        <span className="inline-block -skew-x-12 bg-[linear-gradient(90deg,#e02bd6_0%,#e02bd6_48%,#2d7bff_52%,#35c8ff_100%)] bg-clip-text text-[clamp(2rem,7vw,4.5rem)] leading-none font-black text-transparent italic drop-shadow-[0_0_18px_rgb(255_255_255/35%)]">
          {t("features.bootSplash.versus")}
        </span>
      </p>
      <div
        role="status"
        aria-label={t("features.bootSplash.loading")}
        className="flex items-center gap-3 text-sm text-white/80"
      >
        <span className="h-0.5 w-16 animate-pulse rounded-full bg-[linear-gradient(90deg,#e02bd6,#35c8ff)] motion-reduce:animate-none" />
        {t("features.bootSplash.loading")}
        <span className="h-0.5 w-16 animate-pulse rounded-full bg-[linear-gradient(90deg,#35c8ff,#e02bd6)] motion-reduce:animate-none" />
      </div>
    </div>
  );
}
