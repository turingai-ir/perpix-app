import { useEffect, useMemo, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";

import { getPostLoginPath } from "../model/auth-navigation";
import type { z } from "zod";

import { createLoginSchema } from "../model/schemas";
import { failureOf } from "../model/auth-failure";
import { useAuthFeedback } from "../hooks/use-auth-feedback";
import { useAuthFormMessages } from "../hooks/use-auth-form-messages";
import { useLoginMutation } from "../hooks/use-auth-mutations";

import { AuthCard } from "./auth-card";
import { AuthField } from "./auth-field";
import { FormAlert, SubmitButton } from "./form-feedback";

import { LoginActions } from "./login-actions";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

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
  const navigate = useNavigate();
  const { search } = useLocation();
  const messages = useAuthFormMessages();
  const schema = useMemo(() => createLoginSchema(messages), [messages]);
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: { phone_number: phone, password: "" },
  });
  const { setFocus } = form;
  useEffect(() => setFocus("password"), [setFocus]);
  const feedback = useAuthFeedback(form);
  const login = useLoginMutation();
  const [reactionId, setReactionId] = useState(0);
  const [isEntering, setIsEntering] = useState(false);

  const onSubmit = async (values: z.output<typeof schema>) => {
    feedback.clear();
    try {
      await login.mutateAsync(values);
    } catch (error) {
      feedback.handleError(error);
      if (failureOf(error).kind === "invalid-credentials") {
        setReactionId((id) => id + 1);
      }

      return;
    }
    setIsEntering(true);
    await onAuthenticated();
    void navigate(getPostLoginPath(search), { replace: true });
  };

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
            login.isPending ||
            isResetPending ||
            isEntering ||
            feedback.lockedSeconds > 0
          }
          onForgotPassword={async () => {
            feedback.clear();
            try {
              await onForgotPassword();
            } catch (error) {
              feedback.handleError(error);
            }
          }}
        />
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            isPending={login.isPending || isResetPending || isEntering}
            lockedSeconds={feedback.lockedSeconds}
          />
        </form>
      </Form>
    </AuthCard>
  );
};
