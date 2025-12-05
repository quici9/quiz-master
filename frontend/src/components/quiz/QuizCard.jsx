import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import { ClockIcon, QuestionMarkCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function QuizCard({ quiz }) {
  const { t } = useTranslation('quiz');
  const difficultyColors = {
    EASY: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-200 dark:border-green-500/30',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-200 dark:border-yellow-500/30',
    HARD: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-200 dark:border-red-500/30',
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-gray-200 dark:bg-white/5 dark:border-white/10">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${difficultyColors[quiz.difficulty] || 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/10 dark:text-white/70 dark:border-white/20'}`}>
          {t(`card.difficulty.${quiz.difficulty.toLowerCase()}`)}
        </span>
        {quiz.category && (
          <span className="text-xs text-gray-600 bg-gray-100 border-gray-200 dark:text-white/70 font-medium dark:bg-white/10 px-2 py-1 rounded border dark:border-white/10">
            {quiz.category.name}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{quiz.title}</h3>
      <p className="text-sm text-gray-600 dark:text-white/60 mb-4 flex-grow line-clamp-3">{quiz.description}</p>

      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-white/50">
          <div className="flex items-center gap-1">
            <QuestionMarkCircleIcon className="w-4 h-4" />
            <span>{t('card.questionsCount', { count: quiz.questionsCount || quiz.totalQuestions || 0 })}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>{quiz.timeLimit ? t('card.timeLimit', { minutes: Math.ceil(quiz.timeLimit / 60) }) : t('card.noLimit')}</span>
          </div>
        </div>

        <Link to={`/quizzes/${quiz.id}`} className="block">
          <Button variant="primary" className="w-full">
            {t('card.viewDetails')}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
