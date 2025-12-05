import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import attemptService from '../../services/attempt.service';
import ScoreDisplay from '../../components/result/ScoreDisplay';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { ClockIcon, CalendarIcon, ArrowPathIcon, ListBulletIcon, HomeIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatDate';

export default function QuizResult() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await attemptService.getAttemptById(attemptId);
        setResult(response.data);
      } catch (error) {
        console.error('Failed to fetch result', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) return <div className="flex justify-center py-12"><Loading size="lg" /></div>;
  if (!result) return <div className="text-center text-white">Result not found</div>;

  const { score, correctAnswers, totalQuestions, timeElapsed, completedAt, quiz } = result;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Quiz Completed!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">{quiz?.title}</p>
      </div>

      <ScoreDisplay
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={totalQuestions}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-6 rounded-2xl flex items-center gap-4 border border-gray-200 dark:border-white/10">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-500/30 shadow-lg shadow-blue-500/10">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Time Taken</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatTime(timeElapsed)}</p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center gap-4 border border-gray-200 dark:border-white/10">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 rounded-full flex items-center justify-center border border-purple-200 dark:border-purple-500/30 shadow-lg shadow-purple-500/10">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed On</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatDate(completedAt)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link to={`/quizzes/${quiz?.id}`} className="w-full sm:w-auto">
          <Button variant="primary" className="w-full justify-center">
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Retake Quiz
          </Button>
        </Link>

        <Link to={`/history/${attemptId}`} className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full justify-center">
            <ListBulletIcon className="w-5 h-5 mr-2" />
            Review Answers
          </Button>
        </Link>

        <Link to="/" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full justify-center">
            <HomeIcon className="w-5 h-5 mr-2" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
