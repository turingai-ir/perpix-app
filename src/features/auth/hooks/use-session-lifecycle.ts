import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import {
  onSessionEnded,
  type SessionEndReason,
} from "../services/session-manager";
import { getLoginPath } from "../model/auth-navigation";

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
  const { pathname, search, hash } = useLocation();
  const status = useAuthStatus();
  const previousStatus = useRef(status);
  const endedReason = useRef<SessionEndReason | null>(null);
  const isOnLogin = pathname === APP_ROUTES_KEY.auth.login.path;

  useEffect(() => {
    const wasAuthenticated = previousStatus.current === "authenticated";
    previousStatus.current = status;
    if (wasAuthenticated && status === "anonymous" && !isOnLogin) {
      const destination =
        endedReason.current === "expired"
          ? getLoginPath(pathname + search + hash)
          : APP_ROUTES_KEY.auth.login.path;
      void navigate(destination, { replace: true });
    }
  }, [status, isOnLogin, navigate, pathname, search, hash]);

  useEffect(
    () =>
      onSessionEnded((reason) => {
        endedReason.current = reason;
        if (reason === "expired") {
          toast.info(t("features.auth.toasts.sessionEnded"));
        }
      }),
    [t],
  );
}
