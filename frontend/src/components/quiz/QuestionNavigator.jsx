import React from 'react';
import { useTranslation } from 'react-i18next';

export default function QuestionNavigator({
  questions,
  currentIndex,
  answers,
  bookmarks,
  reviewMode = false,
  feedbackHistory = {},
  onJumpTo,
  className = '',
}) {
  const { t } = useTranslation('quiz');

  return (
    <div className={`glass rounded-2xl p-6 border border-gray-200 dark:border-white/10 ${className}`}>
      <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide opacity-80">{t('navigator.title')}</h4>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, index) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = index === currentIndex;
          const isBookmarked = !!bookmarks[q.id];

          // Check feedback in Review Mode
          const feedback = reviewMode && feedbackHistory[q.id];
          const isCorrect = feedback?.isCorrect;
          const isIncorrect = feedback && !feedback.isCorrect;

          return (
            <button
              key={q.id}
              onClick={() => onJumpTo(index)}
              className={`
                relative h-10 rounded-lg font-medium text-sm flex items-center justify-center transition-all duration-200
                ${isCurrent
                  ? 'ring-2 ring-primary-500 dark:ring-primary-400 ring-offset-2 ring-offset-transparent z-10 bg-primary-500 text-white'
                  : ''}
                ${!isCurrent && isCorrect
                  ? 'bg-success-100 text-success-700 border border-success-200 dark:bg-success-500/20 dark:text-success-200 dark:border-success-500/30 hover:bg-success-200 dark:hover:bg-success-500/30'
                  : ''}
                ${!isCurrent && isIncorrect
                  ? 'bg-danger-100 text-danger-700 border border-danger-200 dark:bg-danger-500/20 dark:text-danger-200 dark:border-danger-500/30 hover:bg-danger-200 dark:hover:bg-danger-500/30'
                  : ''}
                ${!isCurrent && !isCorrect && !isIncorrect && isAnswered && !reviewMode
                  ? 'bg-success-100 text-success-700 border border-success-200 dark:bg-success-500/20 dark:text-success-200 dark:border-success-500/30 hover:bg-success-200 dark:hover:bg-success-500/30'
                  : ''}
                ${!isCurrent && !isCorrect && !isIncorrect && !isAnswered
                  ? 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-white/5 dark:text-white/60 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                  : ''}
              `}
            >
              {index + 1}
              {isBookmarked && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-sm" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-white/60">
        {reviewMode ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success-100 border border-success-200 dark:bg-success-500/20 dark:border-success-500/30 rounded"></div>
              <span>{t('navigator.legend.correct')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-danger-100 border border-danger-200 dark:bg-danger-500/20 dark:border-danger-500/30 rounded"></div>
              <span>{t('navigator.legend.incorrect')}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success-100 border border-success-200 dark:bg-success-500/20 dark:border-success-500/30 rounded"></div>
            <span>{t('navigator.legend.answered')}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded"></div>
          <span>{t('navigator.legend.unanswered')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span>{t('navigator.legend.bookmarked')}</span>
        </div>
      </div>
    </div>
  );
}
