import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import deTranslation from '../../../packages/editor/src/translation/process-editor/de.json';
import enTranslation from '../../../packages/editor/src/translation/process-editor/en.json';

export const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
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
