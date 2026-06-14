import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const IS_SENTRY_ENABLED = !import.meta.env.DEV;

if (IS_SENTRY_ENABLED && !SENTRY_DSN) {
  throw Error("SENTRY_DSN env is required");
}

if (IS_SENTRY_ENABLED) {
  Sentry.init({
    dsn: SENTRY_DSN,
    release: __APP_RELEASE__,
    integrations: [],
    tracesSampleRate: 0,
  });
}

function captureError(error: unknown, componentStack?: string) {
  if (!IS_SENTRY_ENABLED) {
    return;
  }

  Sentry.withScope((scope) => {
    if (componentStack) {
      scope.setContext("react", { componentStack });
    }

    Sentry.captureException(error);
  });
}

export { captureError };
