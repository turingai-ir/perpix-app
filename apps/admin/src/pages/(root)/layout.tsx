import { useEffect, type FC } from "react";
import { Outlet, useMatches } from "react-router";
import { toast } from "sonner";

import { useAppTranslate } from "@/hooks";
import { appEventBus } from "@/lib/event-bus";
import { HttpStatus } from "@/utils";
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";

const RootLayout: FC = () => {
  const { t } = useAppTranslate();

  useEffect(() => {
    const errorhandler = async (error: unknown) => {
      if (
        error instanceof FetchNetworkError ||
        error instanceof FetchTimeoutError
      ) {
        toast.error(t("common.fetchErrors.network"));
        return;
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
            } else if (Array.isArray(parseError?.detail)) {
              const messages = parseError.detail
                .map((i: { msg?: string }) => i?.msg)
                .filter(Boolean);
              toast.error(messages.join(" - "));
            }
          } catch {
            /* empty */
          }
          return;
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
          return;
        }

        if (error.response.status === HttpStatus.FORBIDDEN) {
          toast.error(t("common.fetchErrors.forbidden"));
          return;
        }

        if (error.response.status === HttpStatus.TOO_MANY_REQUESTS) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === "string") {
              toast.error(parseError.detail);
              return;
            }
          } catch {
            /* empty */
          }
          toast.error(t("common.fetchErrors.timeout"));
          return;
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
  }, [t]);

  const matches = useMatches();
  const matchWithTitle = [...matches]
    .reverse()
    .find(
      (m) => m.handle && typeof m.handle === "object" && "title" in m.handle,
    );
  const titleKey = matchWithTitle
    ? (matchWithTitle.handle as { title: string }).title
    : "";
  const pageTitle = titleKey ? String(titleKey) : "PerPix Admin Panel";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return <Outlet />;
};

export default RootLayout;
