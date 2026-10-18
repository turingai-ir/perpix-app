import { useEffect, useState } from "react";

import type { AuthChallenge } from "../model/types";

const secondsUntil = (isoTime: string, now: number) =>
  Math.max(0, Math.ceil((Date.parse(isoTime) - now) / 1000));

export function useChallengeTimers(challenge: AuthChallenge) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    expiresInSeconds: secondsUntil(challenge.expires_at, now),
    resendInSeconds: secondsUntil(challenge.resend_available_at, now),
  };
}
