import type { FC } from "react";

import { useLoginForm } from "../hooks/use-login-form";

import { AuthCard } from "./auth-card";
import { AuthField } from "./auth-field";
import { FormAlert, SubmitButton } from "./form-feedback";

import { LoginActions } from "./login-actions";
import { Form } from "@/shared/ui/form";
import { PasswordInput } from "@/shared/ui/password-input";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

interface LoginFormProps {
  phone: string;
  onForgotPassword: () => Promise<void>;
  onBack: () => void;
  isResetPending: boolean;
  onAuthenticated: () => Promise<void>;
}

export const LoginForm: FC<LoginFormProps> = ({
  phone,
  onForgotPassword,
  onBack,
  isResetPending,
  onAuthenticated,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const {
    feedback,
    form,
    handleForgotPassword,
    isEntering,
    isLoginPending,
    reactionId,
    submit,
  } = useLoginForm({ phone, onForgotPassword, onAuthenticated });

  return (
    <AuthCard
      title={t("features.auth.login.title")}
      description={t("features.auth.login.description")}
      reaction={
        reactionId
          ? {
              id: reactionId,
              kind: "password",
              message: t("features.auth.login.wrongPasswordReaction"),
            }
          : undefined
      }
      footer={
        <LoginActions
          onBack={onBack}
          disabled={
            isLoginPending ||
            isResetPending ||
            isEntering ||
            feedback.lockedSeconds > 0
          }
          onForgotPassword={handleForgotPassword}
        />
      }
    >
      <Form {...form}>
        <form onSubmit={submit} className="space-y-8">
          <AuthField
            name="password"
            label={t("features.auth.login.passwordLabel")}
          >
            {(field) => (
              <PasswordInput
                dir="ltr"
                autoComplete="current-password"
                {...field}
              />
            )}
          </AuthField>
          <FormAlert message={feedback.message} />
          <SubmitButton
            label={t("features.auth.login.submit")}
            isPending={isLoginPending || isResetPending || isEntering}
            lockedSeconds={feedback.lockedSeconds}
          />
        </form>
      </Form>
    </AuthCard>
  );
};
