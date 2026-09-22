import { useEffect, type FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import ErrorSection from "@/components/custom/error-section";
import LoadingSection from "@/components/custom/loading-section";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEditUserInfo, useUser } from "@/feature/user";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

import { AccountGlance } from "./_components/account-glance";
import { IdentityHero } from "./_components/identity-hero";
import "./settings.css";

const ProfileSettingsPage: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const userState = useUser();
  const editState = useEditUserInfo();
  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        t("common.validationErrors.required", {
          name: t("pages.profile.settings.userInfo.form.name.label"),
        }),
      )
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
    email: z.union([
      z.email(t("common.validationErrors.email")),
      z.literal(""),
    ]),
    mobile: z.string(),
  });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", mobile: "" },
  });

  useEffect(() => {
    if (userState.data && !form.formState.isDirty) {
      form.reset({
        name: userState.data.name ?? "",
        email: userState.data.email ?? "",
        mobile: userState.data.phone_number,
      });
    }
  }, [userState.data, form, form.formState.isDirty]);

  async function onSubmit(values: FormValues) {
    try {
      await editState.mutateAsync({
        body: { name: values.name, email: values.email || null },
      });
      form.reset(values);
      void userState.refetch();
      toast.success(
        t("pages.profile.settings.userInfo.form.successSetPasswordToast"),
      );
    } catch {
      toast.error(t("pages.profile.settings.saveError"));
    }
  }

  if (userState.isError) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <ErrorSection onRetry={() => userState.refetch()} />
      </div>
    );
  }
  if (!userState.data) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LoadingSection />
      </div>
    );
  }

  return (
    <div className="settings-page pb-12">
      <IdentityHero user={userState.data} />
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
        <section
          className="settings-panel min-w-0 p-5 sm:p-8"
          aria-labelledby="personal-info-title"
        >
          <div className="mb-8 flex items-start gap-4">
            <div className="settings-icon-box">
              <UserRound aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="settings-eyebrow">
                {t("pages.profile.settings.accountDetails")}
              </p>
              <h2
                id="personal-info-title"
                className="mt-1 text-xl font-bold tracking-tight sm:text-2xl"
              >
                {t("pages.profile.settings.personalInfo")}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-7">
                {t("pages.profile.settings.personalInfoHint")}
              </p>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("pages.profile.settings.userInfo.form.name.label")}
                      </FormLabel>
                      <div className="settings-input-wrap">
                        <UserRound
                          aria-hidden="true"
                          className="settings-field-icon"
                        />
                        <FormControl>
                          <Input
                            {...field}
                            autoComplete="name"
                            className="settings-input"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("pages.profile.settings.userInfo.form.email.label")}
                      </FormLabel>
                      <div className="settings-input-wrap">
                        <Mail
                          aria-hidden="true"
                          className="settings-field-icon"
                        />
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            dir="ltr"
                            autoComplete="email"
                            className="settings-input settings-input-ltr"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("pages.profile.settings.userInfo.form.mobile.label")}
                      </FormLabel>
                      <div className="settings-input-wrap">
                        <Phone
                          aria-hidden="true"
                          className="settings-field-icon"
                        />
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            type="tel"
                            dir="ltr"
                            autoComplete="tel"
                            className="settings-input settings-input-ltr"
                          />
                        </FormControl>
                      </div>
                      <p className="text-muted-foreground text-xs leading-6">
                        {t("pages.profile.settings.mobileReadOnly")}
                      </p>
                    </FormItem>
                  )}
                />
              </div>
              <div className="border-border/70 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground flex items-center gap-2 text-xs">
                  <LockKeyhole aria-hidden="true" className="size-4" />
                  {t("pages.profile.settings.secureNote")}
                </p>
                <Button
                  type="submit"
                  disabled={editState.isPending || !form.formState.isDirty}
                  className="h-11 min-w-44 gap-2 rounded-xl shadow-[0_8px_24px_-8px_var(--primary)]"
                >
                  {editState.isPending ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                  ) : (
                    <ArrowLeft aria-hidden="true" className="size-4" />
                  )}
                  {t("pages.profile.settings.userInfo.form.submit")}
                </Button>
              </div>
            </form>
          </Form>
        </section>
        <AccountGlance />
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
