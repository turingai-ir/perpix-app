import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";
import type { z } from "zod";

import { getPostLoginPath } from "../model/auth-navigation";
import { createLoginSchema } from "../model/schemas";
import { failureOf } from "../model/auth-failure";
import { useAuthFeedback } from "./use-auth-feedback";
import { useAuthFormMessages } from "./use-auth-form-messages";
import { useLoginMutation } from "./use-auth-mutations";

interface UseLoginFormInput {
  phone: string;
  onForgotPassword: () => Promise<void>;
  onAuthenticated: () => Promise<void>;
}

/** Password step: validation, login, error feedback and post-login redirect. */
export function useLoginForm({
  phone,
  onForgotPassword,
  onAuthenticated,
}: UseLoginFormInput) {
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

  const handleForgotPassword = async () => {
    feedback.clear();
    try {
      await onForgotPassword();
    } catch (error) {
      feedback.handleError(error);
    }
  };

  return {
    feedback,
    form,
    handleForgotPassword,
    isEntering,
    isLoginPending: login.isPending,
    reactionId,
    submit: form.handleSubmit(onSubmit),
  };
}
