import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import tr from './locales/tr.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

const STORAGE_KEY = 'eventhub-lang'
const savedLang = localStorage.getItem(STORAGE_KEY)

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: savedLang ?? 'tr',
  fallbackLng: 'tr',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
})

document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = i18n.language

export default i18n
