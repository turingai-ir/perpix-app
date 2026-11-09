import { useEffect, useRef } from "react";
import { useLocation, useMatches } from "react-router";
import { toast } from "sonner";
import { useSetAtom } from "jotai";

import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/shared/utils/custom-fetch/fetch-errors";
import { HttpStatus } from "@/shared/utils";
import { useAppTranslate } from "@/shared/hooks";
import { getViewportBreakpoints } from "@/shared/hooks/use-viewport-breakpoint";
import { appEventBus } from "@/shared/lib/event-bus";
import { useAuthStatus, useSessionLifecycle } from "@/features/auth";
import { usePricingFeature } from "@/features/pricing";
import { appLayoutAtom } from "@/features/app-layout";

const AUTH_ENDPOINT_PREFIX = "/api/v1/auth/";
const AUTH_ENDPOINTS_WITH_OWN_ERRORS = "api-tokens";

const isAuthEndpointError = (error: unknown): boolean => {
  if (!(error instanceof FetchHttpError)) return false;
  const url =
    typeof error.request === "string" ? error.request : error.request.url;
  const { pathname } = new URL(url, window.location.origin);

  return (
    pathname.startsWith(AUTH_ENDPOINT_PREFIX) &&
    !pathname.startsWith(AUTH_ENDPOINT_PREFIX + AUTH_ENDPOINTS_WITH_OWN_ERRORS)
  );
};

export function useRootLayout() {
  const { t } = useAppTranslate();
  const authStatus = useAuthStatus();
  useSessionLifecycle();
  const { openPricingFeature } = usePricingFeature();
  const location = useLocation();
  const setAppLayoutState = useSetAtom(appLayoutAtom);
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    const errorhandler = async (error: unknown) => {
      if (
        error instanceof FetchNetworkError ||
        error instanceof FetchTimeoutError
      ) {
        toast.error(t("common.fetchErrors.network"));
        return;
      }

      if (isAuthEndpointError(error)) {
        return;
      }

      if (
        error instanceof FetchHttpError &&
        error.response.status === HttpStatus.UPGRADE_REQUIRED
      ) {
        const parsedError = await error.parseJson();
        const requiredScopes =
          typeof parsedError === "object" &&
          parsedError !== null &&
          "required_scopes" in parsedError &&
          Array.isArray(parsedError.required_scopes)
            ? parsedError.required_scopes.filter(
                (scope): scope is string => typeof scope === "string",
              )
            : [];

        openPricingFeature({ requiredScopes });
      }

      if (
        error instanceof FetchHttpError &&
        typeof error.request !== "string" &&
        error.request.method.toLowerCase() !== "get"
      ) {
        if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === "string") {
              toast.error(parseError.detail);
            } else if (parseError?.detail && Array.isArray(parseError.detail)) {
              const messages: string[] = [];
              parseError.detail.forEach((i: any) => {
                if (i?.msg && typeof i?.msg === "string") {
                  messages.push(i.msg);
                }
              });
              toast.error(messages.join("\n"));
            }
          } catch {
            /* empty */
          }
        }
        if (error.response.status === HttpStatus.BAD_REQUEST) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === "string") {
              toast.error(parseError.detail);
            }
          } catch {
            /* empty */
          }
        }
        if (error.response.status === HttpStatus.FORBIDDEN) {
          let message = t("common.fetchErrors.forbidden");
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === "string") {
              message = parseError.detail;
            }
          } catch {
            /* empty */
          }
          toast.error(message);
        }
        if (error.response.status === HttpStatus.TOO_MANY_REQUESTS) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === "string") {
              toast.error(parseError.detail);
            }
          } catch {
            /* empty */
          }
        }
        if (error.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
          toast.error(t("common.fetchErrors.serverError"));
        }
      }
    };

    const unsubscribe = appEventBus.on("API_ERROR_EVENT", errorhandler);
    return () => {
      unsubscribe();
    };
  }, [openPricingFeature, t]);

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) {
      return;
    }

    previousPathnameRef.current = location.pathname;

    if (getViewportBreakpoints().lg) return;

    setAppLayoutState((state) => ({
      ...state,
      isSidebarOpen: false,
    }));
  }, [location.pathname, setAppLayoutState]);

  const matches = useMatches();
  const matchWithTitle = [...matches]
    .reverse()
    .find(
      (m) => m.handle && typeof m.handle === "object" && "title" in m.handle,
    );
  const titleKey = matchWithTitle
    ? (matchWithTitle.handle as { title: string }).title
    : "";
  const pageTitle = titleKey ? t(titleKey) : "PerPix";

  return {
    authStatus,
    pageTitle,
  };
}
