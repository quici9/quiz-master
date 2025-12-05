import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language || 'en';

    const toggleLanguage = () => {
        const newLang = currentLang === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/80"
            title={currentLang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
            aria-label="Toggle language"
        >
            <GlobeAltIcon className="w-5 h-5" />
            <span className="font-semibold uppercase">
                {currentLang === 'en' ? 'EN' : 'VI'}
            </span>
        </button>
    );
}
