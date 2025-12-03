import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { ClockIcon, QuestionMarkCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function QuizCard({ quiz }) {
  const difficultyColors = {
    EASY: 'bg-green-500/20 text-green-200 border-green-500/30',
    MEDIUM: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    HARD: 'bg-red-500/20 text-red-200 border-red-500/30',
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/5 border-white/10">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${difficultyColors[quiz.difficulty] || 'bg-white/10 text-white/70 border-white/20'}`}>
          {quiz.difficulty}
        </span>
        {quiz.category && (
          <span className="text-xs text-white/70 font-medium bg-white/10 px-2 py-1 rounded border border-white/10">
            {quiz.category.name}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{quiz.title}</h3>
      <p className="text-sm text-white/60 mb-4 flex-grow line-clamp-3">{quiz.description}</p>

      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-sm text-white/50">
          <div className="flex items-center gap-1">
            <QuestionMarkCircleIcon className="w-4 h-4" />
            <span>{quiz.questionsCount || quiz.totalQuestions || 0} Qs</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>{quiz.timeLimit ? `${Math.ceil(quiz.timeLimit / 60)}m` : 'No limit'}</span>
          </div>
        </div>

        <Link to={`/quizzes/${quiz.id}`} className="block">
          <Button variant="primary" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
