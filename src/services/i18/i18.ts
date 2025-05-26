import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

import faTranslation from './locales/fa.json'
import { I18_KEYS } from './keys'

const resources: Resource = {
  fa: { [I18_KEYS.RESOURCES.MAIN]: faTranslation },
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
