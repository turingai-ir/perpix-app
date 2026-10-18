import { useEffect, useRef, type FC } from "react";
import { Outlet, useLocation, useMatches } from "react-router";
import { toast } from "sonner";
import { useSetAtom } from "jotai";

import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";
import { HttpStatus } from "@/utils";
import { useAppTranslate } from "@/hooks";
import { appEventBus } from "@/lib/event-bus";
import {
  AuthUnavailable,
  useAuthStatus,
  useSessionLifecycle,
} from "@/features/auth";
import { usePricingFeature } from "@/feature/pricing";
import { PaymentEventsProvider } from "@/feature/payment";
import appLayoutAtom from "@/pages/(app)/_layout/_state";

const AUTH_ENDPOINT_PREFIX = "/api/v1/auth/";
const AUTH_ENDPOINTS_WITH_OWN_ERRORS = "api-tokens";

const isAuthEndpointError = (error: unknown) => {
  if (!(error instanceof FetchHttpError)) return false;
  const url =
    typeof error.request === "string" ? error.request : error.request.url;
  const { pathname } = new URL(url, window.location.origin);

  return (
    pathname.startsWith(AUTH_ENDPOINT_PREFIX) &&
    !pathname.startsWith(AUTH_ENDPOINT_PREFIX + AUTH_ENDPOINTS_WITH_OWN_ERRORS)
  );
};

const RootLayout: FC = () => {
  const { t } = useAppTranslate();
  const authStatus = useAuthStatus();
  useSessionLifecycle();
  const { openPricingFeature } = usePricingFeature();
  const location = useLocation();
  const setAppLayoutState = useSetAtom(appLayoutAtom);
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    const errorhandler = async (error: unknown) => {
      if (error instanceof FetchNetworkError) {
        toast.error(t("common.fetchErrors.network"));
      }

      if (error instanceof FetchTimeoutError) {
        toast.error(t("common.fetchErrors.network"));
      }

      // Session recovery and sign-out on 401 live in the auth feature; the
      // auth endpoints report their own errors inside their forms.
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

        openPricingFeature({
          requiredScopes,
        });
      }

      if (
        error instanceof FetchHttpError &&
        typeof error.request !== "string" &&
        error.request.method.toLowerCase() !== "get"
      ) {
        // validation error
        if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === "string") {
              toast.error(
                <div className="flex flex-col gap-1">
                  <span>{parseError.detail}</span>
                </div>,
              );
            } else if (
              parseError?.detail &&
              parseError.detail instanceof Array
            ) {
              const messages: string[] = [];
              parseError.detail.forEach((i: any) => {
                if (i?.msg && typeof i?.msg === "string") {
                  messages.push(i.msg);
                }
              });
              toast.error(
                <div className="flex flex-col gap-1">
                  {messages.map((i, index) => (
                    <span key={index}>{i}</span>
                  ))}
                </div>,
              );
            }
          } catch {
            /* empty */
          }
        }
        if (error.response.status === HttpStatus.BAD_REQUEST) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === "string") {
              toast.error(
                <div className="flex flex-col gap-1">
                  <span>{parseError?.detail}</span>
                </div>,
              );
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
          toast.error(
            <div className="flex flex-col gap-1">
              <span>{message}</span>
            </div>,
          );
        }
        if (error.response.status === HttpStatus.TOO_MANY_REQUESTS) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === "string") {
              toast.error(
                <div className="flex flex-col gap-1">
                  <span>{parseError?.detail}</span>
                </div>,
              );
            }
          } catch {
            /* empty */
          }
        }
        if (error.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
          toast.error(
            <div className="flex flex-col gap-1">
              <span>{t("common.fetchErrors.serverError")}</span>
            </div>,
          );
        }
      }
    };

    const appEventBusListener = appEventBus.on("API_ERROR_EVENT", errorhandler);
    return () => {
      appEventBusListener();
    };
  }, [openPricingFeature, t]);

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) {
      return;
    }

    setAppLayoutState((state) => ({
      ...state,
      isSidebarOpen: false,
    }));

    previousPathnameRef.current = location.pathname;
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

  return (
    <>
      <title>{pageTitle}</title>
      <PaymentEventsProvider />
      {authStatus === "unavailable" ? <AuthUnavailable /> : <Outlet />}
    </>
  );
};

export default RootLayout;
