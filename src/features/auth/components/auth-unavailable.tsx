import { useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router";

import { getLoginPath } from "../model/auth-navigation";

import { retryBootstrap } from "../services/session-manager";

import { Button } from "@/components/ui/button";
import { Heading2, Paragraph } from "@/components/ui/typography";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

/** Shown when the session check failed for network/server reasons, not credentials. */
export const AuthUnavailable: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = async () => {
    setIsRetrying(true);
    const status = await retryBootstrap();
    setIsRetrying(false);
    if (status === "anonymous") {
      void navigate(getLoginPath(pathname + search + hash), { replace: true });
    }
  };

  return (
    <main
      role="alert"
      className="grid h-dvh w-full place-content-center justify-items-center gap-4 p-4 text-center"
    >
      <Heading2>{t("features.auth.bootstrap.unavailableTitle")}</Heading2>
      <Paragraph>
        {t("features.auth.bootstrap.unavailableDescription")}
      </Paragraph>
      <Button onClick={retry} disabled={isRetrying}>
        {t("features.auth.bootstrap.retry")}
      </Button>
    </main>
  );
};
