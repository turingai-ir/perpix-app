import type { FC } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImmerAtom } from "jotai-immer";
import { LoaderCircle } from "lucide-react";

import authLoginPageState from "../_state";

import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { accessTokenCookieOptions, cookies } from "@/utils/cookies";
import { useStart } from "../_hooks";

const AuthLoginPageStart: FC = () => {
  const [pageState, setPageState] = useImmerAtom(authLoginPageState);
  const cookie = cookies();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const startState = useStart();
  const formSchema = z.object({
    mobile: z
      .string({})
      .transform((value) => {
        let normalized = value.trim();

        if (normalized.startsWith("+98")) {
          normalized = normalized.replace("+98", "0");
        }

        if (normalized.startsWith("98")) {
          normalized = normalized.replace("98", "0");
        }

        if (/^9\d{9}$/.test(normalized)) {
          normalized = `0${normalized}`;
        }

        return normalized;
      })
      .refine((value) => REGEX.mobile.test(value), {
        message: t("common.validationErrors.mobile"),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: pageState.mobile,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await startState.mutateAsync({
      body: {
        phone_number: values.mobile,
      },
    });
    cookie.set(
      APP_KEYS.COOKIES.ACCESS_TOKEN,
      data.token,
      accessTokenCookieOptions,
    );
    setPageState((draft) => {
      draft.mobile = values.mobile;
      draft.currentView = data.is_verified ? "PASSWORD" : "SET_PASSWORD";
    });
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
              name="mobile"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t("pages.auth.login.startForm.mobile.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      dir="ltr"
                      type="number"
                      placeholder="0912345678"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <FormMessage />
                  ) : (
                    <Muted>
                      {t("pages.auth.login.startForm.mobile.description")}
                    </Muted>
                  )}
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={startState.isPending}
            >
              {startState.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                t("pages.auth.login.startForm.submit")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AuthLoginPageStart;
