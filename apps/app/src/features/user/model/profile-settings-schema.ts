import z from "zod";
import type { TFunction } from "i18next";

export function createProfileSettingsSchema(t: TFunction) {
  return z.object({
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
}

export type ProfileSettingsSchema = ReturnType<
  typeof createProfileSettingsSchema
>;
export type ProfileSettingsFormValues = z.infer<ProfileSettingsSchema>;
