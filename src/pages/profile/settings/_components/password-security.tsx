import { KeyRound, LockKeyhole } from "lucide-react";

import { ChangePasswordForm } from "@/features/auth";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

export function PasswordSecurity() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <section
      className="settings-panel settings-security-panel overflow-hidden"
      aria-labelledby="password-security-title"
    >
      <div className="settings-security-intro relative overflow-hidden p-6 sm:p-8">
        <span className="settings-security-mark" aria-hidden="true">
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
          className="settings-security-watermark absolute -bottom-10 -left-10 size-52"
          strokeWidth={0.6}
        />
      </div>
      <div className="settings-security-form min-w-0 p-6 sm:p-8">
        <ChangePasswordForm />
      </div>
    </section>
  );
}
