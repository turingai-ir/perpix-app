import { Activity, useEffect, type FC } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link } from "react-router";
import { LoaderCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import LoadingSection from "@/components/custom/loading-section";
import ErrorSection from "@/components/custom/error-section";
import { APP_ROUTES_KEY } from "@/router/routes";
import { useEditUserInfo, useUser } from "@/pages/_hooks";

const ProfileSettingsPage: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const userState = useUser();
  const editUserInfoState = useEditUserInfo();

  const formSchema = z.object({
    name: z
      .string({
        error: t("common.validationErrors.required", {
          name: t("pages.profile.settings.userInfo.form.name.label"),
        }),
      })
      .trim()
      .max(
        128,
        t("common.validationErrors.maxLength", {
          name: t("pages.profile.settings.userInfo.form.name.label"),
          max: 128,
        }),
      )
      .regex(
        /^[\u0600-\u06FFa-zA-Z\s]+$/,
        t("common.validationErrors.onlyEnglishAndPersianCharacters", {
          name: t("pages.profile.settings.userInfo.form.name.label"),
        }),
      ),

    mobile: z.string({}),
    email: z.email(t("common.validationErrors.email")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
      email: "",
      name: "",
    },
  });

  useEffect(() => {
    if (userState.isSuccess) {
      form.setValue("email", userState.data.email ?? "");
      form.setValue("name", userState.data.name ?? "");
      form.setValue("mobile", userState.data.phone_number ?? "");
    }
  }, [userState.isSuccess, userState.data, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await editUserInfoState.mutateAsync({
      body: {
        name: values.name,
        email: values.email,
      },
    });
    toast.success(
      t("pages.profile.settings.userInfo.form.successSetPasswordToast"),
    );
  }

  if (userState.isError) {
    return (
      <div className="mx-auto flex h-full items-center justify-center py-4">
        <ErrorSection onRetry={() => userState.refetch()} />
      </div>
    );
  }

  const isUserLoading = userState.isLoading || !userState.data;

  return (
    <>
      {isUserLoading ? (
        <div className="mx-auto flex h-full items-center justify-center py-4">
          <LoadingSection />
        </div>
      ) : null}

      <Activity mode={isUserLoading ? "hidden" : "visible"}>
        <div className="mx-auto flex min-h-full max-w-xl items-center justify-center p-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t("pages.profile.settings.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          {t("pages.profile.settings.userInfo.form.name.label")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        {fieldState.error ? (
                          <FormMessage />
                        ) : (
                          <Muted>
                            {t(
                              "pages.profile.settings.userInfo.form.name.description",
                            )}
                          </Muted>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "pages.profile.settings.userInfo.form.email.label",
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input dir="ltr" type="email" {...field} />
                        </FormControl>
                        {fieldState.error ? <FormMessage /> : null}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    disabled
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "pages.profile.settings.userInfo.form.mobile.label",
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            dir="ltr"
                            type="number"
                            placeholder="0912345678"
                            {...field}
                          />
                        </FormControl>
                        {fieldState.error ? <FormMessage /> : null}
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={editUserInfoState.isPending}
                  >
                    {editUserInfoState.isPending ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      t("pages.profile.settings.userInfo.form.submit")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <Link className="w-full" to={APP_ROUTES_KEY.app.path}>
                <Button className="w-full" variant="link">
                  {t("pages.profile.settings.userInfo.backToHome")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </Activity>
    </>
  );
};

export default ProfileSettingsPage;
