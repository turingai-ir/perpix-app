import { useTranslation } from 'react-i18next'

import { APP_KEYS } from '../../utils'

export const useAppTranslate = (
  ns?: (typeof APP_KEYS.I18NEXT.RESOURCES)[keyof typeof APP_KEYS.I18NEXT.RESOURCES],
) => useTranslation(ns ? ns : APP_KEYS.I18NEXT.RESOURCES.MAIN)
