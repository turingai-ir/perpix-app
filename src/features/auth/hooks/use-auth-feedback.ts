import { useCallback, useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { failureOf, type AuthFailure } from "../model/auth-failure";

import { useAppTranslate, useSecondsCountDown } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

export type FailureContext = "default" | "change-password";

type Translate = (key: string, options?: Record<string, unknown>) => string;

function messageFor(
  failure: AuthFailure,
  context: FailureContext,
  t: Translate,
): string {
  const key = "features.auth.failures.";
  switch (failure.kind) {
    case "invalid-credentials":
      return t(
        key +
          (context === "change-password"
            ? "currentPasswordInvalid"
            : "invalidCredentials"),
      );
    case "challenge-invalid":
      return t(`${key}challengeInvalid`);
    case "rate-limited":
      return failure.retryAfterSeconds
        ? t(`${key}rateLimited`, { seconds: failure.retryAfterSeconds })
        : t(`${key}rateLimitedUnknown`);
    case "upgrade-required":
      return t(`${key}upgradeRequired`);
    default:
      return t(`${key}${failure.kind}`);
  }
}

/**
 * Turns auth failures into a form-level alert, per-field errors for 422, and
 * a submit lock while the server-announced rate-limit window is open.
 */
export function useAuthFeedback<Values extends FieldValues>(
  form: UseFormReturn<Values>,
  context: FailureContext = "default",
) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const lock = useSecondsCountDown(0);
  const [message, setMessage] = useState<string | null>(null);
  const { setSeconds } = lock;
  const { getValues, setError } = form;

  const handleError = useCallback(
    (error: unknown) => {
      const failure = failureOf(error);
      const text = messageFor(failure, context, t as Translate);
      if (failure.kind === "rate-limited" && failure.retryAfterSeconds) {
        setSeconds(Math.ceil(failure.retryAfterSeconds));
      }
      const known =
        failure.kind === "validation"
          ? failure.fields.filter((name) => name in getValues())
          : [];
      known.forEach((name) =>
        setError(name as Path<Values>, { message: text }),
      );
      setMessage(known.length > 0 ? null : text);
    },
    [context, getValues, setError, setSeconds, t],
  );

  const clear = useCallback(() => setMessage(null), []);

  return { message, handleError, clear, lockedSeconds: lock.seconds };
}
