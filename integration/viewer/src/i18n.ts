import { deTranslation, enTranslation } from '@axonivy/process-editor';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n.use(LanguageDetector).init({
    debug: true,
    supportedLngs: ['en', 'de'],
    fallbackLng: 'en',
    ns: ['process-editor'],
    defaultNS: 'process-editor',
    resources: {
      en: { 'process-editor': enTranslation },
      de: { 'process-editor': deTranslation }
    },
    detection: {
      order: ['querystring']
    }
  });
};
