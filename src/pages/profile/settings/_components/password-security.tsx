import { KeyRound, LockKeyhole } from "lucide-react";

import { ChangePasswordForm } from "@/features/auth";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

import { SettingsPanel } from "./settings-parts";

export function PasswordSecurity() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <SettingsPanel
      className="grid grid-cols-1 overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"
      aria-labelledby="password-security-title"
    >
      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_100%_0,rgb(205_126_245/22%),transparent_58%),linear-gradient(145deg,oklch(0.2_0.07_295/93%),oklch(0.28_0.05_230/82%))] p-6 text-white shadow-[inset_0_1px_rgb(255_255_255/12%)] sm:p-8">
        <span
          className="relative z-1 grid size-14 place-items-center rounded-2xl border border-white/24 bg-white/9 shadow-[inset_0_1px_rgb(255_255_255/17%)]"
          aria-hidden="true"
        >
          <LockKeyhole className="size-6" strokeWidth={1.7} />
        </span>
        <div className="relative z-10 mt-8 max-w-sm">
          <h2
            id="password-security-title"
            className="text-2xl font-bold tracking-tight"
          >
            {t("features.auth.changePassword.title")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/80">
            {t("features.auth.changePassword.description")}
          </p>
        </div>
        <KeyRound
          aria-hidden="true"
          className="absolute -bottom-10 -left-10 size-52 -rotate-24 text-white/8"
          strokeWidth={0.6}
        />
      </div>
      <div className="border-primary/16 bg-card/60 [&_[data-slot=input]]:bg-muted/38 min-w-0 border-t bg-[radial-gradient(ellipse_at_5%_5%,var(--ambient-brand),transparent_58%),radial-gradient(ellipse_at_90%_110%,var(--ambient-media),transparent_58%)] p-6 sm:p-8 md:border-s md:border-t-0 [&_[data-slot=input]]:h-12 [&_[data-slot=input]]:rounded-[0.8rem] [&_[data-slot=input]]:border-[color-mix(in_srgb,var(--primary)_15%,var(--border))] [&_[data-slot=input]]:shadow-[inset_0_1px_rgb(255_255_255/6%)]">
        <ChangePasswordForm />
      </div>
    </SettingsPanel>
  );
}
