import { useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import type { AuthChallenge, ChallengePurpose } from "../model/types";
import { createPhoneSchema } from "../model/schemas";
import { useAuthFeedback } from "../hooks/use-auth-feedback";
import { useAuthFormMessages } from "../hooks/use-auth-form-messages";
import {
  usePasswordResetChallengeMutation,
  useRegistrationChallengeMutation,
} from "../hooks/use-auth-mutations";

import { AuthCard } from "./auth-card";
import { AuthField } from "./auth-field";
import { FormAlert, SubmitButton } from "./form-feedback";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface ChallengeStartFormProps {
  purpose: ChallengePurpose;
  onChallenge: (phone: string, challenge: AuthChallenge) => void;
  onBackToLogin: () => void;
}

export const ChallengeStartForm: FC<ChallengeStartFormProps> = ({
  purpose,
  onChallenge,
  onBackToLogin,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const copy = purpose === "registration" ? "register" : "reset";
  const messages = useAuthFormMessages();
  const schema = useMemo(() => createPhoneSchema(messages), [messages]);
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({ resolver: zodResolver(schema), defaultValues: { phone_number: "" } });
  const feedback = useAuthFeedback(form);
  const registration = useRegistrationChallengeMutation();
  const reset = usePasswordResetChallengeMutation();
  const mutation = purpose === "registration" ? registration : reset;

  const onSubmit = async ({ phone_number }: z.output<typeof schema>) => {
    feedback.clear();
    try {
      onChallenge(phone_number, await mutation.mutateAsync(phone_number));
    } catch (error) {
      feedback.handleError(error);
    }
  };

  return (
    <AuthCard
      title={t(`features.auth.${copy}.title`)}
      description={t(`features.auth.${copy}.description`)}
      footer={
        <Button type="button" variant="link" onClick={onBackToLogin}>
          {t("features.auth.reset.backToLogin")}
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <AuthField
            name="phone_number"
            label={t("features.auth.login.phoneLabel")}
            hint={t("features.auth.login.phoneHint")}
          >
            {(field) => (
              <Input dir="ltr" type="tel" inputMode="tel" {...field} />
            )}
          </AuthField>
          <FormAlert message={feedback.message} />
          <SubmitButton
            label={t(`features.auth.${copy}.submit`)}
            isPending={mutation.isPending}
            lockedSeconds={feedback.lockedSeconds}
          />
        </form>
      </Form>
    </AuthCard>
  );
};
