import { useEffect, useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";

import { createLoginSchema } from "../model/schemas";
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
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

interface LoginFormProps {
  phone: string;
  onForgotPassword: () => Promise<void>;
  onBack: () => void;
  isResetPending: boolean;
}

export const LoginForm: FC<LoginFormProps> = ({
  phone,
  onForgotPassword,
  onBack,
  isResetPending,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
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

  const onSubmit = async (values: z.output<typeof schema>) => {
    feedback.clear();
    try {
      await login.mutateAsync(values);
    } catch (error) {
      feedback.handleError(error);

      return;
    }
    toast.success(t("features.auth.toasts.loggedIn"));
    void navigate(APP_ROUTES_KEY.app.path, { replace: true });
  };

  return (
    <AuthCard
      title={t("features.auth.login.title")}
      description={t("features.auth.login.description")}
      footer={
        <LoginActions
          onBack={onBack}
          disabled={
            login.isPending || isResetPending || feedback.lockedSeconds > 0
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
            isPending={login.isPending || isResetPending}
            lockedSeconds={feedback.lockedSeconds}
          />
        </form>
      </Form>
    </AuthCard>
  );
};
