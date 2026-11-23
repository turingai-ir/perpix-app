import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  LoaderCircle,
  MessageSquareText,
  Send,
} from "lucide-react";
import { useSmsTest } from "../hooks/use-sms-test";
import { SmsTestError } from "../services/send-test-sms";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";

export function SmsTestPage() {
  const { t } = useAppTranslate();
  const schema = useMemo(
    () =>
      z.object({
        phone_number: z
          .string()
          .trim()
          .transform((value) =>
            value.replace(/[۰-۹٠-٩]/g, (digit) =>
              String(digit.charCodeAt(0) % 16),
            ),
          )
          .transform((value) =>
            value.startsWith("09") ? `+98${value.slice(1)}` : value,
          )
          .pipe(z.string().regex(/^\+989[0-9]{9}$/, t("smsTest.invalidPhone"))),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { phone_number: "" },
  });
  const sms = useSmsTest();
  const kind = sms.error instanceof SmsTestError ? sms.error.kind : "server";
  return (
    <main className="mx-auto max-w-5xl space-y-7 px-5 py-8 sm:px-8 sm:py-10">
      <div>
        <h1 className="text-3xl font-bold">{t("smsTest.title")}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t("smsTest.description")}
        </p>
      </div>
      <section
        aria-labelledby="sms-form-title"
        className="max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageSquareText aria-hidden="true" />
        </div>
        <h2 id="sms-form-title" className="text-lg font-semibold">
          {t("smsTest.formTitle")}
        </h2>
        <p className="mt-3 mb-7 text-sm leading-7 text-muted-foreground">
          {t("smsTest.hint")}
        </p>
        <form
          noValidate
          aria-busy={sms.isPending}
          onSubmit={handleSubmit((values) => {
            if (!sms.isPending && !sms.seconds) sms.mutate(values);
          })}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label htmlFor="sms-phone" className="text-sm font-medium">
              {t("smsTest.phone")}
            </label>
            <input
              id="sms-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder="09123456789"
              disabled={sms.isPending}
              aria-invalid={!!errors.phone_number}
              aria-describedby={
                errors.phone_number ? "sms-phone-error" : "sms-phone-hint"
              }
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("phone_number")}
            />
            <p id="sms-phone-hint" className="text-xs text-muted-foreground">
              {t("smsTest.phoneHint")}
            </p>
            {errors.phone_number && (
              <p
                id="sms-phone-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.phone_number.message}
              </p>
            )}
          </div>
          {sms.isError && (
            <p role="alert" className="text-sm leading-7 text-destructive">
              {t(`smsTest.errors.${kind}`)}
              {sms.seconds > 0 && (
                <span> {t("smsTest.wait", { count: sms.seconds })}</span>
              )}
            </p>
          )}
          {sms.isSuccess && (
            <div
              role="status"
              className="rounded-xl bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle2 aria-hidden="true" className="mb-2 size-5" />
              {t("smsTest.success", { phone: sms.variables?.phone_number })}
            </div>
          )}
          <Button
            type="submit"
            disabled={sms.isPending || sms.seconds > 0}
            className="h-12 w-full rounded-xl"
          >
            {sms.isPending ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Send aria-hidden="true" />
            )}
            {t(sms.isPending ? "smsTest.pending" : "smsTest.submit")}
          </Button>
        </form>
      </section>
      <p className="max-w-xl text-xs leading-7 text-muted-foreground">
        {t("smsTest.budget")}
      </p>
    </main>
  );
}
