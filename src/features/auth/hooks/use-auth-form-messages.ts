import { useMemo } from "react";

import type { AuthFormMessages } from "../model/schemas";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

export function useAuthFormMessages(): AuthFormMessages {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return useMemo(
    () => ({
      phone: t("features.auth.validation.phone"),
      otp: t("features.auth.validation.otp"),
      passwordRequired: t("features.auth.validation.passwordRequired"),
      newPasswordLength: t("features.auth.validation.newPasswordLength"),
      passwordMismatch: t("features.auth.validation.passwordMismatch"),
    }),
    [t],
  );
}
