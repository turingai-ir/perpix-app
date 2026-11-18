import { useTranslation } from "react-i18next";

import { APP_I18_KEYS } from "@/shared/i18n";

export const useAppTranslate = (
  ns?: (typeof APP_I18_KEYS.RESOURCES)[keyof typeof APP_I18_KEYS.RESOURCES],
) => useTranslation(ns ? ns : APP_I18_KEYS.RESOURCES.MAIN);
