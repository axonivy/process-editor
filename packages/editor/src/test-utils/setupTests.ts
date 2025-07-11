import i18n from 'i18next';
import 'reflect-metadata';
import enTranslation from '../translation/process-editor/en.json';

const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['process-editor'],
    defaultNS: 'process-editor',
    resources: { en: { 'process-editor': enTranslation } }
  });
};

initTranslation();
