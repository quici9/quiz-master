import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({
  show,
  onClose,
  title,
  children,
  size = 'md',
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (show) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose]);

  if (!show) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`relative bg-white dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl shadow-2xl w-full ${sizes[size]} transform transition-all text-gray-900 dark:text-white`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-white/60 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 rounded-full p-1 transition-colors focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
