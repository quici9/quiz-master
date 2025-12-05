import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export const DarkModeToggle: React.FC = () => {
    const { isDark, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
        >
            {isDark ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
                <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
        </button>
    );
};
