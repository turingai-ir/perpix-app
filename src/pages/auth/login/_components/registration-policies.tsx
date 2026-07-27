import type { FC } from "react";

import { Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

const perpixMainUrl = import.meta.env.VITE_PERPIX_MAIN_URL;
const termsUrl = new URL("/terms/", perpixMainUrl).toString();
const privacyUrl = new URL("/privacy/", perpixMainUrl).toString();

const AuthLoginPageRegistrationPolicies: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <Muted className="text-center">
      {t("pages.auth.login.registrationPolicies.description")} {" "}
      <a
        className="text-primary underline"
        href={termsUrl}
        target="_blank"
        rel="noreferrer"
      >
        {t("pages.auth.login.registrationPolicies.terms")}
      </a>{" "}
      <span aria-hidden="true">
        {t("pages.auth.login.registrationPolicies.separator")}
      </span>{" "}
      <a
        className="text-primary underline"
        href={privacyUrl}
        target="_blank"
        rel="noreferrer"
      >
        {t("pages.auth.login.registrationPolicies.privacy")}
      </a>{" "}
      {t("pages.auth.login.registrationPolicies.agreementSuffix")}
    </Muted>
  );
};

export default AuthLoginPageRegistrationPolicies;
