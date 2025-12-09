import React from 'react';
import { useTranslation } from 'react-i18next';

const RecoveryDialog = ({ isOpen, onRecover, onDiscard, lastSavedTime }) => {
    const { t } = useTranslation('common');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('recovery.title')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {t('recovery.message', { date: new Date(lastSavedTime).toLocaleString() })}
                    </p>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onDiscard}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t('recovery.discard')}
                    </button>
                    <button
                        onClick={onRecover}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        {t('recovery.resume')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecoveryDialog;
