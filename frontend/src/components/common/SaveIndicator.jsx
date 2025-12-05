import React from 'react';

const SaveIndicator = ({ isSaving, lastSaved, error }) => {
    if (error) {
        return (
            <div className="flex items-center text-danger-600 dark:text-danger-500 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Not saved</span>
            </div>
        );
    }

    if (isSaving) {
        return (
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
            </div>
        );
    }

    if (lastSaved) {
        return (
            <div className="flex items-center text-success-600 dark:text-green-500 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
        );
    }

    return null;
};

export default SaveIndicator;
