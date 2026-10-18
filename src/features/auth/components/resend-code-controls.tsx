import type { FC } from "react";
import { toast } from "sonner";

import type { AuthChallenge, ChallengePurpose } from "../model/types";
import { useChallengeTimers } from "../hooks/use-challenge-timers";
import {
  usePasswordResetChallengeMutation,
  useRegistrationChallengeMutation,
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
}

export const ResendCodeControls: FC<ResendCodeControlsProps> = ({
  purpose,
  phone,
  challenge,
  onChallenge,
  onError,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const timers = useChallengeTimers(challenge);
  const resend = useResendChallengeMutation();
  const registration = useRegistrationChallengeMutation();
  const reset = usePasswordResetChallengeMutation();
  const isExpired = timers.expiresInSeconds <= 0;
  const request = isExpired
    ? purpose === "registration"
      ? () => registration.mutateAsync(phone)
      : () => reset.mutateAsync(phone)
    : () => resend.mutateAsync(challenge.challenge_id);
  const isPending =
    resend.isPending || registration.isPending || reset.isPending;

  const handleClick = async () => {
    try {
      onChallenge(await request());
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
      disabled={isPending}
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
