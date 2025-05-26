import { useTranslation } from 'react-i18next'

import { I18_KEYS } from '@/services/i18'

export const useAppTranslate = (
  ns?: (typeof I18_KEYS.RESOURCES)[keyof typeof I18_KEYS.RESOURCES],
) => useTranslation(ns ? ns : I18_KEYS.RESOURCES.MAIN)
