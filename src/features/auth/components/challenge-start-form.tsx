import { useRef, type FC } from "react";

import type { AuthStart } from "../model/types";
import { useChallengeStartForm } from "../hooks/use-challenge-start-form";

import { AuthCard } from "./auth-card";
import { AuthField } from "./auth-field";
import { FormAlert, SubmitButton } from "./form-feedback";

import { Form } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

interface ChallengeStartFormProps {
  phone: string;
  onStart: (phone: string, result: AuthStart) => void;
}

export const ChallengeStartForm: FC<ChallengeStartFormProps> = ({
  phone,
  onStart,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const formElement = useRef<HTMLFormElement>(null);
  const { feedback, form, isPending, submit } = useChallengeStartForm({
    formElement,
    phone,
    onStart,
  });

  return (
    <AuthCard
      title={t("pages.auth.login.title")}
      description={t("pages.auth.login.description")}
    >
      <Form {...form}>
        <form ref={formElement} onSubmit={submit} className="space-y-8">
          <AuthField
            name="phone_number"
            label={t("features.auth.login.phoneLabel")}
            hint={t("features.auth.login.phoneHint")}
          >
            {(field) => (
              <Input
                dir="ltr"
                type="tel"
                inputMode="tel"
                autoComplete="username"
                {...field}
              />
            )}
          </AuthField>
          <FormAlert message={feedback.message} />
          <SubmitButton
            label={t("pages.auth.login.startForm.submit")}
            isPending={isPending}
            lockedSeconds={feedback.lockedSeconds}
          />
        </form>
      </Form>
    </AuthCard>
  );
};
