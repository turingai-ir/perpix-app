import type { FC } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useImmerAtom } from "jotai-immer";

import authLoginPageState from "../_state";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import { Heading2, Muted, Paragraph } from "@/components/ui/typography";
import { APP_KEYS, REGEX } from "@/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { accessTokenCookieOptions, cookies } from "@/utils/cookies";
import { APP_ROUTES_KEY } from "@/router/routes";
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin, useResetPassword } from "../_hooks";

const AuthLoginPageEnterPassword: FC = () => {
  const navigate = useNavigate();
  const cookie = cookies();
  const [pageState, setPageState] = useImmerAtom(authLoginPageState);

  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const loginState = useLogin();
  const resetPasswordState = useResetPassword();
  const formSchema = z.object({
    password: z
      .string({})
      .transform((value) => {
        let normalized = value.trim();

        if (normalized.startsWith("+98")) {
          normalized = normalized.replace("+98", "0");
        }

        if (/^9\d{9}$/.test(normalized)) {
          normalized = `0${normalized}`;
        }

        return normalized;
      })
      .refine((value) => REGEX.password.test(value), {
        message: t("common.validationErrors.password"),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await loginState.mutateAsync({
      body: {
        password: values.password,
      },
    });
    cookie.set(
      APP_KEYS.COOKIES.ACCESS_TOKEN,
      data.token,
      accessTokenCookieOptions,
    );
    setPageState((draft) => {
      draft.currentView = "START";
    });
    navigate(APP_ROUTES_KEY.app.path);
    toast.success(t("pages.auth.login.enterPasswordForm.successLoginToast"));
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <Heading2 className="text-center">
            {t("pages.auth.login.title")}
          </Heading2>
        </CardTitle>
        <CardDescription>
          <Paragraph className="text-center">
            {t("pages.auth.login.description")}
          </Paragraph>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t("pages.auth.login.enterPasswordForm.password.label")}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput dir="ltr" {...field} />
                  </FormControl>
                  {fieldState.error ? (
                    <FormMessage />
                  ) : (
                    <Muted>
                      {t(
                        "pages.auth.login.enterPasswordForm.password.description",
                      )}
                    </Muted>
                  )}
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={loginState.isPending}
            >
              {loginState.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                t("pages.auth.login.enterPasswordForm.submit")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          disabled={resetPasswordState.isPending}
          variant="link"
          onClick={async () => {
            const data = await resetPasswordState.mutateAsync({
              body: { phone_number: pageState.mobile },
            });
            cookie.set(
              APP_KEYS.COOKIES.ACCESS_TOKEN,
              data.token,
              accessTokenCookieOptions,
            );
            setPageState((draft) => {
              draft.currentView = "SET_PASSWORD";
            });
            toast.info(t("pages.auth.login.successSendOtp"));
          }}
        >
          {resetPasswordState.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Muted>{t("pages.auth.login.forgetPassword")}</Muted>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthLoginPageEnterPassword;
