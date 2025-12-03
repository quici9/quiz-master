import React from 'react';

export default function QuestionNavigator({
  questions,
  currentIndex,
  answers,
  bookmarks,
  onJumpTo,
  className = '',
}) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide opacity-80">Question Navigator</h4>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, index) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = index === currentIndex;
          const isBookmarked = !!bookmarks[q.id];

          return (
            <button
              key={q.id}
              onClick={() => onJumpTo(index)}
              className={`
                relative h-10 rounded-lg font-medium text-sm flex items-center justify-center transition-all duration-200
                ${isCurrent
                  ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-transparent z-10 bg-primary-500 text-white'
                  : ''}
                ${!isCurrent && isAnswered
                  ? 'bg-success-500/20 text-success-200 border border-success-500/30 hover:bg-success-500/30'
                  : ''}
                ${!isCurrent && !isAnswered
                  ? 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
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

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success-500/20 border border-success-500/30 rounded"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white/5 border border-white/10 rounded"></div>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span>Bookmarked</span>
        </div>
      </div>
    </div>
  );
}
