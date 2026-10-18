import { useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { createChangePasswordSchema } from "../model/schemas";
import { useAuthFeedback } from "../hooks/use-auth-feedback";
import { useAuthFormMessages } from "../hooks/use-auth-form-messages";
import { useChangePasswordMutation } from "../hooks/use-auth-mutations";

import { AuthField } from "./auth-field";
import { FormAlert, SubmitButton } from "./form-feedback";
import { NewPasswordFields } from "./new-password-fields";

import { Form } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

export const ChangePasswordForm: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const messages = useAuthFormMessages();
  const schema = useMemo(
    () => createChangePasswordSchema(messages),
    [messages],
  );
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const feedback = useAuthFeedback(form, "change-password");
  const change = useChangePasswordMutation();

  const onSubmit = async (values: z.output<typeof schema>) => {
    feedback.clear();
    try {
      await change.mutateAsync({
        current_password: values.current_password,
        new_password: values.new_password,
      });
      toast.success(t("features.auth.toasts.passwordChanged"));
    } catch (error) {
      feedback.handleError(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AuthField
          name="current_password"
          label={t("features.auth.changePassword.currentLabel")}
        >
          {(field) => (
            <PasswordInput
              dir="ltr"
              autoComplete="current-password"
              {...field}
            />
          )}
        </AuthField>
        <NewPasswordFields
          passwordName="new_password"
          passwordLabel={t("features.auth.changePassword.newLabel")}
          confirmLabel={t("features.auth.changePassword.confirmLabel")}
          hint={t("features.auth.complete.passwordHint")}
        />
        <FormAlert message={feedback.message} />
        <SubmitButton
          label={t("features.auth.changePassword.submit")}
          isPending={change.isPending}
          lockedSeconds={feedback.lockedSeconds}
        />
      </form>
    </Form>
  );
};
