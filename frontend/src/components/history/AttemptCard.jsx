import React from 'react';
import { formatRelativeTime } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';
import Button from '../common/Button';
import { clsx } from 'clsx';

export default function AttemptCard({ attempt, onResume, onReview }) {
  const { quizTitle, score, correctAnswers, totalQuestions, status, completedAt, timeSpent } = attempt;

  const percentage = Math.round(score || 0);

  // Map status colors to glass theme
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-success-100 text-success-700 border-success-200 dark:bg-success-500/20 dark:text-success-200 dark:border-success-500/30';
      case 'IN_PROGRESS': return 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-500/20 dark:text-primary-200 dark:border-primary-500/30';
      default: return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/10 dark:text-white/60 dark:border-white/20';
    }
  };

  return (
    <div className="glass rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10">
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{quizTitle}</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-white/60">
          <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium border", getStatusColor(status))}>
            {STATUS_LABELS[status]}
          </span>
          <span>{formatRelativeTime(completedAt || attempt.startedAt)}</span>
          {status === 'COMPLETED' && (
            <>
              <span>Score: <strong className="text-gray-900 dark:text-white">{percentage}%</strong> ({correctAnswers}/{totalQuestions})</span>
              <span>Time: {formatTime(timeSpent)}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        {status === 'COMPLETED' ? (
          <Button variant="secondary" onClick={onReview}>
            Review
          </Button>
        ) : (
          <Button variant="primary" onClick={onResume}>
            Resume
          </Button>
        )}
      </div>
    </div>
  );
}

