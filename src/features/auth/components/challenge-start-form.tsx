import { useEffect, useMemo, useRef, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router";
import type { z } from "zod";

import type { AuthStart } from "../model/types";
import { createPhoneSchema } from "../model/schemas";
import { useAuthFeedback } from "../hooks/use-auth-feedback";
import { useAuthFormMessages } from "../hooks/use-auth-form-messages";
import { useStartAuthMutation } from "../hooks/use-auth-mutations";

import { AuthCard } from "./auth-card";
import { AuthField } from "./auth-field";
import { FormAlert, SubmitButton } from "./form-feedback";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface ChallengeStartFormProps {
  phone: string;
  onStart: (phone: string, result: AuthStart) => void;
}

export const ChallengeStartForm: FC<ChallengeStartFormProps> = ({
  phone,
  onStart,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const messages = useAuthFormMessages();
  const schema = useMemo(() => createPhoneSchema(messages), [messages]);
  const [searchParams, setSearchParams] = useSearchParams();
  const linkedPhone = searchParams.get("phone");
  const formElement = useRef<HTMLFormElement>(null);
  const hasAutoSubmitted = useRef(false);
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: { phone_number: linkedPhone ?? phone },
  });
  const feedback = useAuthFeedback(form);
  const mutation = useStartAuthMutation();
  const { setValue } = form;

  useEffect(() => {
    if (hasAutoSubmitted.current || linkedPhone === null) return;
    if (!schema.safeParse({ phone_number: linkedPhone }).success) return;
    hasAutoSubmitted.current = true;
    setValue("phone_number", linkedPhone);
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("phone");
        return next;
      },
      { replace: true },
    );
    formElement.current?.requestSubmit();
  }, [linkedPhone, schema, setSearchParams, setValue]);

  const onSubmit = async ({ phone_number }: z.output<typeof schema>) => {
    feedback.clear();
    try {
      onStart(phone_number, await mutation.mutateAsync(phone_number));
    } catch (error) {
      feedback.handleError(error);
    }
  };

  return (
    <AuthCard
      title={t("pages.auth.login.title")}
      description={t("pages.auth.login.description")}
    >
      <Form {...form}>
        <form
          ref={formElement}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
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
            isPending={mutation.isPending}
            lockedSeconds={feedback.lockedSeconds}
          />
        </form>
      </Form>
    </AuthCard>
  );
};
