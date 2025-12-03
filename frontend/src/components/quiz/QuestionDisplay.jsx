import React from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

export default function QuestionDisplay({
  question,
  selectedOptionId,
  onSelectOption,
  isBookmarked,
  onToggleBookmark,
}) {
  if (!question) return null;

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-medium text-white leading-relaxed">
          <span className="font-bold text-primary-400 mr-2">Q{question.order || '?'}:</span>
          {question.text}
        </h3>
        <button
          onClick={onToggleBookmark}
          className="text-white/40 hover:text-yellow-400 transition-colors ml-4"
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
        >
          {isBookmarked ? (
            <BookmarkIconSolid className="w-6 h-6 text-yellow-400" />
          ) : (
            <BookmarkIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 group
              ${selectedOptionId === option.id
                ? 'border-primary-500/50 bg-primary-500/20 text-white shadow-lg shadow-primary-500/10'
                : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20'
              }`}
          >
            <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm border transition-colors
              ${selectedOptionId === option.id
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white/10 text-white/60 border-white/10 group-hover:bg-white/20 group-hover:text-white'
              }`}
            >
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-grow">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
