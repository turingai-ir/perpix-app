import { useTranslation } from 'react-i18next';

import { APP_I18_KEYS } from '@/services/i18';

export const useAppTranslate = (
  ns?: (typeof APP_I18_KEYS.RESOURCES)[keyof typeof APP_I18_KEYS.RESOURCES],
) => useTranslation(ns ? ns : APP_I18_KEYS.RESOURCES.MAIN);
