import type { FC } from "react";
import { toast } from "sonner";

import type { AuthChallenge, ChallengePurpose } from "../model/types";
import { useChallengeTimers } from "../hooks/use-challenge-timers";
import {
  usePasswordResetChallengeMutation,
  useStartAuthMutation,
  useResendChallengeMutation,
} from "../hooks/use-auth-mutations";

import { Button } from "@/components/ui/button";
import { Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface ResendCodeControlsProps {
  purpose: ChallengePurpose;
  phone: string;
  challenge: AuthChallenge;
  onChallenge: (challenge: AuthChallenge) => void;
  onError: (error: unknown) => void;
  lockedSeconds: number;
  onBack: () => void;
}

export const ResendCodeControls: FC<ResendCodeControlsProps> = ({
  purpose,
  phone,
  challenge,
  onChallenge,
  onError,
  lockedSeconds,
  onBack,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const timers = useChallengeTimers(challenge);
  const resend = useResendChallengeMutation();
  const start = useStartAuthMutation();
  const reset = usePasswordResetChallengeMutation();
  const isExpired = timers.expiresInSeconds <= 0;
  const isPending = resend.isPending || start.isPending || reset.isPending;

  const handleClick = async () => {
    try {
      if (isExpired && purpose === "registration") {
        const result = await start.mutateAsync(phone);
        if (result.next_step === "password") {
          onBack();
          return;
        }
        onChallenge(result);
      } else if (isExpired) {
        onChallenge(await reset.mutateAsync(phone));
      } else {
        onChallenge(await resend.mutateAsync(challenge.challenge_id));
      }
      toast.info(t("features.auth.toasts.codeResent"));
    } catch (error) {
      onError(error);
    }
  };

  if (!isExpired && timers.resendInSeconds > 0) {
    return (
      <Muted>
        {t("features.auth.complete.resendIn", {
          seconds: timers.resendInSeconds,
        })}
      </Muted>
    );
  }

  return (
    <Button
      type="button"
      variant="link"
      disabled={isPending || lockedSeconds > 0}
      onClick={handleClick}
    >
      {t(
        isExpired
          ? "features.auth.complete.requestNew"
          : "features.auth.complete.resend",
      )}
    </Button>
  );
};
