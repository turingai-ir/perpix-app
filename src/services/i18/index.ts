import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

import { APP_KEYS } from '../../utils'

import faTranslation from './locales/fa.json'

const resources: Resource = {
  fa: { [APP_KEYS.I18NEXT.RESOURCES.MAIN]: faTranslation },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'fa',
  fallbackLng: 'fa',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
