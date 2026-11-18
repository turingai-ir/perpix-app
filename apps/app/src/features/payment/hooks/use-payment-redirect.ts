import { useCallback, useEffect, useRef } from "react";

import { useSecondsCountDown } from "@/shared/hooks";

/** Redirects to the gateway once, after the countdown or on demand. */
export function usePaymentRedirect(paymentUrl: string, totalSeconds: number) {
  const { seconds } = useSecondsCountDown(totalSeconds);
  const redirected = useRef(false);
  const redirect = useCallback(() => {
    if (redirected.current) return;
    redirected.current = true;
    window.location.assign(paymentUrl);
  }, [paymentUrl]);
  useEffect(() => {
    if (seconds === 0) redirect();
  }, [seconds, redirect]);

  return { redirect, seconds };
}
