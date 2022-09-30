import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import {LanguageEnum} from 'core/enums';

import {enGb} from './locales/en-gb';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: LanguageEnum.En,
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: enGb
    }
  });

export default i18n;
