import { useMemo, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";

import { getPostLoginPath } from "../model/auth-navigation";
import { toast } from "sonner";
import type { z } from "zod";

import type { AuthChallenge, ChallengePurpose } from "../model/types";
import { failureOf } from "../model/auth-failure";
import { createCompleteChallengeSchema } from "../model/schemas";
import { useAuthFeedback } from "../hooks/use-auth-feedback";
import { useAuthFormMessages } from "../hooks/use-auth-form-messages";
import {
  useCompletePasswordResetMutation,
  useCompleteRegistrationMutation,
} from "../hooks/use-auth-mutations";

import { AuthCard } from "./auth-card";
import { FormAlert, SubmitButton } from "./form-feedback";
import { NewPasswordFields } from "./new-password-fields";
import { OtpField } from "./otp-field";
import RegistrationPolicies from "./registration-policies";
import { ResendCodeControls } from "./resend-code-controls";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface ChallengeCompleteFormProps {
  purpose: ChallengePurpose;
  phone: string;
  challenge: AuthChallenge;
  onChallenge: (challenge: AuthChallenge) => void;
  onPasswordReset: () => void;
  onBack: () => void;
  onAuthenticated: () => Promise<void>;
}

export const ChallengeCompleteForm: FC<ChallengeCompleteFormProps> = ({
  purpose,
  phone,
  challenge,
  onChallenge,
  onPasswordReset,
  onBack,
  onAuthenticated,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const { search } = useLocation();
  const isRegistration = purpose === "registration";
  const messages = useAuthFormMessages();
  const schema = useMemo(
    () => createCompleteChallengeSchema(messages),
    [messages],
  );
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: { otp_code: "", password: "", confirm_password: "" },
  });
  const feedback = useAuthFeedback(form);
  const register = useCompleteRegistrationMutation();
  const reset = useCompletePasswordResetMutation();
  const [reactionId, setReactionId] = useState(0);
  const [isEntering, setIsEntering] = useState(false);

  const onSubmit = async (values: z.output<typeof schema>) => {
    feedback.clear();
    const base = {
      challenge_id: challenge.challenge_id,
      otp_code: values.otp_code,
    };
    try {
      if (isRegistration) {
        await register.mutateAsync({ ...base, password: values.password });
        setIsEntering(true);
        await onAuthenticated();
        void navigate(getPostLoginPath(search), { replace: true });
      } else {
        await reset.mutateAsync({ ...base, new_password: values.password });
        toast.success(t("features.auth.toasts.resetDone"));
        onPasswordReset();
      }
    } catch (error) {
      feedback.handleError(error);
      if (failureOf(error).kind === "challenge-invalid") {
        setReactionId((id) => id + 1);
      }
    }
  };

  return (
    <AuthCard
      title={t(
        `features.auth.complete.${isRegistration ? "registrationTitle" : "resetTitle"}`,
      )}
      description={t(
        isRegistration
          ? "features.auth.complete.registrationDescription"
          : "features.auth.complete.description",
      )}
      reaction={
        reactionId
          ? {
              id: reactionId,
              kind: "code",
              message: t("features.auth.complete.wrongCodeReaction"),
            }
          : undefined
      }
      footer={
        <Button type="button" variant="link" onClick={onBack}>
          {t("features.auth.complete.back")}
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <OtpField />
          <NewPasswordFields
            passwordName="password"
            passwordLabel={t(
              `features.auth.complete.${isRegistration ? "passwordLabel" : "newPasswordLabel"}`,
            )}
            confirmLabel={t("features.auth.complete.confirmLabel")}
            hint={t("features.auth.complete.passwordHint")}
          />
          <ResendCodeControls
            purpose={purpose}
            phone={phone}
            challenge={challenge}
            onChallenge={onChallenge}
            onError={feedback.handleError}
            lockedSeconds={feedback.lockedSeconds}
            onBack={onBack}
          />
          {isRegistration ? <RegistrationPolicies /> : null}
          <FormAlert message={feedback.message} />
          <SubmitButton
            label={t(
              `features.auth.complete.${isRegistration ? "submitRegistration" : "submitReset"}`,
            )}
            isPending={register.isPending || reset.isPending || isEntering}
            lockedSeconds={feedback.lockedSeconds}
          />
        </form>
      </Form>
    </AuthCard>
  );
};
