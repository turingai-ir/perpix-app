import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { onSessionEnded } from "../services/session-manager";

import { useAuthStatus } from "./use-auth-status";

import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

/**
 * Sends the user to the login page when an authenticated session ends
 * (sign-out here or in another tab, expiry, password change) and tells them
 * when the session expired on its own.
 */
export function useSessionLifecycle() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const status = useAuthStatus();
  const previousStatus = useRef(status);
  const isOnLogin = pathname === APP_ROUTES_KEY.auth.login.path;

  useEffect(() => {
    const wasAuthenticated = previousStatus.current === "authenticated";
    previousStatus.current = status;
    if (wasAuthenticated && status === "anonymous" && !isOnLogin) {
      void navigate(APP_ROUTES_KEY.auth.login.path, { replace: true });
    }
  }, [status, isOnLogin, navigate]);

  useEffect(
    () =>
      onSessionEnded((reason) => {
        if (reason === "expired") {
          toast.info(t("features.auth.toasts.sessionEnded"));
        }
      }),
    [t],
  );
}
