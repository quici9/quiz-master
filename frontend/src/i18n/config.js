import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import locale files
import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import quizEN from './locales/en/quiz.json';
import practiceEN from './locales/en/practice.json';
import adminEN from './locales/en/admin.json';
import errorsEN from './locales/en/errors.json';
import validationEN from './locales/en/validation.json';

import commonVI from './locales/vi/common.json';
import authVI from './locales/vi/auth.json';
import quizVI from './locales/vi/quiz.json';
import practiceVI from './locales/vi/practice.json';
import adminVI from './locales/vi/admin.json';
import errorsVI from './locales/vi/errors.json';
import validationVI from './locales/vi/validation.json';

const resources = {
    en: {
        common: commonEN,
        auth: authEN,
        quiz: quizEN,
        practice: practiceEN,
        admin: adminEN,
        errors: errorsEN,
        validation: validationEN,
    },
    vi: {
        common: commonVI,
        auth: authVI,
        quiz: quizVI,
        practice: practiceVI,
        admin: adminVI,
        errors: errorsVI,
        validation: validationVI,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common', 'auth', 'quiz', 'practice', 'admin', 'errors', 'validation'],

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },

        interpolation: {
            escapeValue: false, // React already escapes
        },

        react: {
            useSuspense: false,
        },

        debug: process.env.NODE_ENV === 'development',
    });

export default i18n;
