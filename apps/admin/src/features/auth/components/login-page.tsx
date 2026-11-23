import { useNavigate } from "react-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useLogin } from "../hooks/use-login";
import { failureOf } from "../model/auth-failure";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";

export function LoginPage() {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const schema = useMemo(
    () =>
      z.object({
        phone_number: z
          .string()
          .trim()
          .transform((value) =>
            value.replace(/[۰-۹٠-٩]/g, (digit) =>
              String(
                "۰۱۲۳۴۵۶۷۸۹".includes(digit)
                  ? "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)
                  : "٠١٢٣٤٥٦٧٨٩".indexOf(digit),
              ),
            ),
          )
          .refine(
            (value) => /^(09\d{9}|\+989\d{9})$/.test(value),
            t("adminLogin.invalidPhone"),
          )
          .transform((value) =>
            value.startsWith("0") ? `+98${value.slice(1)}` : value,
          ),
        password: z.string().min(1, t("adminLogin.requiredPassword")),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { phone_number: "", password: "" },
  });
  const login = useLogin();
  const failure = failureOf(login.error);
  const errorKey =
    failure.kind === "invalid-credentials"
      ? "credentials"
      : failure.kind === "rate-limited"
        ? "rateLimited"
        : failure.kind === "network"
          ? "network"
          : "failed";
  const inputClass =
    "border-input bg-background focus-visible:ring-ring h-12 w-full rounded-xl border px-4 text-sm outline-none focus-visible:ring-2 disabled:opacity-50";

  return (
    <main
      dir="rtl"
      className="flex min-h-svh items-center justify-center bg-background p-6 text-foreground"
    >
      <section
        aria-labelledby="login-title"
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-9"
      >
        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck aria-hidden="true" className="size-6" />
        </div>
        <h1 id="login-title" className="text-2xl font-bold">
          {t("adminLogin.title")}
        </h1>
        <p className="mt-3 mb-8 text-sm leading-7 text-muted-foreground">
          {t("adminLogin.description")}
        </p>
        <form
          noValidate
          onSubmit={handleSubmit((values) =>
            login.mutate(values, {
              onSuccess: () => {
                void navigate("/overview", { replace: true });
              },
            }),
          )}
          className="space-y-5"
          aria-busy={login.isPending}
        >
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              {t("adminLogin.phone")}
            </label>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              autoComplete="username"
              inputMode="tel"
              disabled={login.isPending}
              aria-invalid={!!errors.phone_number}
              aria-describedby={errors.phone_number ? "phone-error" : undefined}
              className={inputClass}
              {...register("phone_number")}
            />
            {errors.phone_number && (
              <p
                id="phone-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.phone_number.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t("adminLogin.password")}
            </label>
            <input
              id="password"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              disabled={login.isPending}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={inputClass}
              {...register("password")}
            />
            {errors.password && (
              <p
                id="password-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>
          {login.isError && (
            <p role="alert" className="text-sm leading-6 text-destructive">
              {t(`adminLogin.${errorKey}`)}
            </p>
          )}
          {login.isSuccess && (
            <p role="status" className="text-sm">
              {t("adminLogin.success")}
            </p>
          )}
          <Button
            type="submit"
            disabled={login.isPending || login.isSuccess}
            className="h-12 w-full rounded-xl"
          >
            {login.isPending && (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            )}
            {t(login.isPending ? "adminLogin.pending" : "adminLogin.submit")}
          </Button>
        </form>
      </section>
    </main>
  );
}
