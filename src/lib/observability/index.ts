const SENTRY_DSN = import.meta.env.VITE_APP_SENTRY_DSN;
const IS_SENTRY_ENABLED = !import.meta.env.DEV;

if (IS_SENTRY_ENABLED && !SENTRY_DSN) {
  throw Error("SENTRY_DSN env is required");
}

type SentryModule = typeof import("@sentry/react");

let sentryModulePromise: Promise<SentryModule> | undefined;

async function getSentry() {
  if (!IS_SENTRY_ENABLED) {
    return null;
  }

  sentryModulePromise ??= import("@sentry/react").then((Sentry) => {
    Sentry.init({
      dsn: SENTRY_DSN,
      release: __APP_RELEASE__,
      integrations: [],
      tracesSampleRate: 0,
    });

    return Sentry;
  });

  return sentryModulePromise;
}

function captureError(error: unknown, componentStack?: string) {
  void getSentry().then((Sentry) => {
    if (!Sentry) {
      return;
    }

    Sentry.withScope((scope) => {
      if (componentStack) {
        scope.setContext("react", { componentStack });
      }

      Sentry.captureException(error);
    });
  });
}

export { captureError };
