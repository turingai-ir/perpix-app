import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { useUser, useEditUserInfo } from "./user-queries";
import {
  createProfileSettingsSchema,
  type ProfileSettingsFormValues,
} from "../model/profile-settings-schema";

export function useProfileSettings() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const userState = useUser();
  const editState = useEditUserInfo();

  const formSchema = useMemo(() => createProfileSettingsSchema(t), [t]);

  const form = useForm<ProfileSettingsFormValues>({
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

  async function onSubmit(values: ProfileSettingsFormValues) {
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

  return {
    t,
    userState,
    editState,
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
