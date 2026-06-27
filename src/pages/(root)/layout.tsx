import { useEffect, type FC } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useSetAtom } from "jotai";

import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";
import { APP_KEYS, HttpStatus } from "@/utils";
import { getViewportBreakpoints, useAppTranslate } from "@/hook";
import { appEventBus } from "@/lib/event-bus";
import { cookies } from "@/utils/cookies";
import { APP_ROUTES_KEY } from "@/router/routes";
import { usePricingFeature } from "@/feature/pricing";
import appLayoutAtom from "@/pages/(app)/_layout/_state";

const RootLayout: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const cookie = cookies();
  const { openPricingFeature } = usePricingFeature();
  const location = useLocation();
  const setAppLayoutState = useSetAtom(appLayoutAtom);

  useEffect(() => {
    const errorhandler = async (error: unknown) => {
      if (error instanceof FetchNetworkError) {
        toast.error(t("common.fetchErrors.network"));
      }

      if (error instanceof FetchTimeoutError) {
        toast.error(t("common.fetchErrors.network"));
      }

      // 401 error
      if (
        error instanceof FetchHttpError &&
        error.response.status === HttpStatus.UNAUTHORIZED
      ) {
        cookie.remove(APP_KEYS.COOKIES.ACCESS_TOKEN);
        navigate(APP_ROUTES_KEY.auth.login.path);
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
            if (parseError?.detail && parseError.detail instanceof Array) {
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
  }, [cookie, navigate, openPricingFeature, t]);

  useEffect(() => {
    if (getViewportBreakpoints().lg) {
      return;
    }

    setAppLayoutState((state) => ({
      ...state,
      isSidebarOpen: false,
    }));
  }, [location.hash, location.pathname, location.search, setAppLayoutState]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default RootLayout;
