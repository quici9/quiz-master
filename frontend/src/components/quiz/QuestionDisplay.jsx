import React from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

export default function QuestionDisplay({
  question,
  selectedOptionId,
  onSelectOption,
  isBookmarked,
  onToggleBookmark,
  disabled = false,
  reviewModeFeedback = null, // { isCorrect, correctOptionId }
}) {
  if (!question) return null;

  return (
    <div className="glass rounded-2xl p-4 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
          <span className="font-bold text-primary-600 dark:text-primary-400 mr-2">Q{question.order || '?'}:</span>
          {question.text}
        </h3>
        <button
          onClick={onToggleBookmark}
          className="text-gray-400 hover:text-yellow-500 dark:text-white/40 dark:hover:text-yellow-400 transition-colors ml-4"
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
        >
          {isBookmarked ? (
            <BookmarkIconSolid className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
          ) : (
            <BookmarkIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectOption = reviewModeFeedback?.correctOptionId === option.id;
          const isWrongSelection = isSelected && reviewModeFeedback && !reviewModeFeedback.isCorrect;

          let buttonClass = `w-full text-left p-3 md:p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 group `;

          if (disabled) {
            buttonClass += 'opacity-70 cursor-not-allowed ';
          }

          // Review Mode feedback styling
          if (reviewModeFeedback) {
            if (isCorrectOption) {
              // Correct answer - green
              buttonClass += 'border-success-500 bg-success-50 text-success-900 dark:border-success-500/70 dark:bg-success-500/20 dark:text-white shadow-lg shadow-success-500/10 ';
            } else if (isWrongSelection) {
              // Wrong selected answer - red
              buttonClass += 'border-danger-500 bg-danger-50 text-danger-900 dark:border-danger-500/70 dark:bg-danger-500/20 dark:text-white shadow-lg shadow-danger-500/10 ';
            } else {
              // Other options - dimmed
              buttonClass += 'border-gray-200 bg-gray-50 text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-white/50 opacity-60 ';
            }
          } else if (isSelected) {
            buttonClass += 'border-primary-500 bg-primary-50 text-primary-900 dark:border-primary-500/50 dark:bg-primary-500/20 dark:text-white shadow-lg shadow-primary-500/10 ';
          } else {
            buttonClass += 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:border-white/20 ';
          }

          return (
            <button
              key={option.id}
              onClick={() => !disabled && onSelectOption(option.id)}
              disabled={disabled}
              className={buttonClass}
            >
              <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm border transition-colors
                ${reviewModeFeedback && isCorrectOption
                  ? 'bg-success-500 text-white border-success-500'
                  : reviewModeFeedback && isWrongSelection
                    ? 'bg-danger-500 text-white border-danger-500'
                    : isSelected
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-gray-100 text-gray-500 border-gray-200 group-hover:bg-gray-200 group-hover:text-gray-700 dark:bg-white/10 dark:text-white/60 dark:border-white/10 dark:group-hover:bg-white/20 dark:group-hover:text-white'
                }`}
              >
                {reviewModeFeedback && isCorrectOption ? '✓'
                  : reviewModeFeedback && isWrongSelection ? '✗'
                    : String.fromCharCode(65 + index)}
              </span>
              <span className="flex-grow">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
