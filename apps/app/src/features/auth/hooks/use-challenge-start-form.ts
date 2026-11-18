import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router";
import type { z } from "zod";

import type { AuthStart } from "../model/types";
import { createPhoneSchema } from "../model/schemas";
import { useAuthFeedback } from "./use-auth-feedback";
import { useAuthFormMessages } from "./use-auth-form-messages";
import { useStartAuthMutation } from "./use-auth-mutations";

interface UseChallengeStartFormInput {
  formElement: RefObject<HTMLFormElement | null>;
  phone: string;
  onStart: (phone: string, result: AuthStart) => void;
}

/**
 * Phone step. A valid `?phone=` link fills the field, is removed from the URL
 * and submits once.
 */
export function useChallengeStartForm({
  formElement,
  phone,
  onStart,
}: UseChallengeStartFormInput) {
  const messages = useAuthFormMessages();
  const schema = useMemo(() => createPhoneSchema(messages), [messages]);
  const [searchParams, setSearchParams] = useSearchParams();
  const linkedPhone = searchParams.get("phone");
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
  }, [formElement, linkedPhone, schema, setSearchParams, setValue]);

  const onSubmit = async ({ phone_number }: z.output<typeof schema>) => {
    feedback.clear();
    try {
      onStart(phone_number, await mutation.mutateAsync(phone_number));
    } catch (error) {
      feedback.handleError(error);
    }
  };

  return {
    feedback,
    form,
    isPending: mutation.isPending,
    submit: form.handleSubmit(onSubmit),
  };
}
