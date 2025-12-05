import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import quizService from '../../services/quiz.service';
import attemptService from '../../services/attempt.service';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import QuizConfigModal from '../../components/quiz/QuizConfigModal';
import toast from 'react-hot-toast';
import { ClockIcon, QuestionMarkCircleIcon, ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatDate';

export default function QuizDetail() {
  const { t } = useTranslation(['quiz', 'common']);
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAttempts, setUserAttempts] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    fetchQuizDetail();
  }, [id]);

  const fetchQuizDetail = async () => {
    setLoading(true);
    try {
      const [quizRes, attemptsRes] = await Promise.all([
        quizService.getQuizById(id),
        attemptService.getMyAttempts({ quizId: id, limit: 5 }),
      ]);
      setQuiz(quizRes.data);
      setUserAttempts(attemptsRes.data.attempts || []);
    } catch (error) {
      console.error(error);
      toast.error(t('detail.errorLoad'));
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartClick = () => {
    const incompleteAttempt = userAttempts.find(a => a.status === 'IN_PROGRESS');

    if (incompleteAttempt) {
      if (window.confirm(t('detail.resumeConfirm'))) {
        navigate(`/quiz/${id}/take?attemptId=${incompleteAttempt.id}`);
        return;
      }
    }

    setShowConfigModal(true);
  };

  const handleConfiguredStart = (config) => {
    setShowConfigModal(false);
    navigate(`/quiz/${id}/take`, { state: { config } });
  };

  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'badge badge-success';
      case 'MEDIUM':
        return 'badge bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-200 dark:border-yellow-500/30 border';
      case 'HARD':
        return 'badge badge-danger';
      default:
        return 'badge badge-primary';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/quizzes" className="inline-flex items-center text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300 transition-colors">
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        {t('detail.backToQuizzes')}
      </Link>

      <Card className="p-8 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 flex-grow">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
                <span className={getDifficultyBadgeClass(quiz.difficulty)}>
                  {t(`card.difficulty.${quiz.difficulty.toLowerCase()}`)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{quiz.description}</p>
            </div>

            <div className="flex flex-wrap gap-6 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <QuestionMarkCircleIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <span className="font-medium">{t('detail.questionsLabel', { count: quiz.questionsCount || quiz.totalQuestions })}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <span className="font-medium">{quiz.timeLimit ? t('detail.timeLimit', { minutes: Math.ceil(quiz.timeLimit / 60) }) : t('detail.noTimeLimit')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <span className="font-medium">{t('detail.avgScore', { score: quiz.stats?.averageScore ? Math.round(quiz.stats.averageScore) : '--' })}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center min-w-[200px]">
            <Button size="lg" onClick={handleStartClick} className="w-full justify-center shadow-lg shadow-primary-500/20">
              {t('detail.startQuiz')}
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white pl-1">{t('detail.previousAttempts')}</h2>
        {userAttempts.length > 0 ? (
          <div className="space-y-3">
            {userAttempts.map(attempt => (
              <Card key={attempt.id} className="flex justify-between items-center py-4 px-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${attempt.score >= 70 ? 'text-success-600 dark:text-success-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {attempt.score !== null ? `${attempt.score}%` : t('detail.inProgress')}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">|</span>
                    <span className="text-gray-500 dark:text-gray-300">{formatDate(attempt.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {attempt.correctAnswers !== null ? t('detail.correctAnswers', { correct: attempt.correctAnswers, total: attempt.totalQuestions }) : t('detail.notCompleted')}
                  </p>
                </div>
                <Link to={attempt.status === 'COMPLETED' ? `/history/${attempt.id}` : `/quiz/${id}/take?attemptId=${attempt.id}`}>
                  <Button variant="secondary" size="sm">
                    {attempt.status === 'COMPLETED' ? t('common:actions.review') : t('common:actions.resume')}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic pl-1">{t('detail.noAttempts')}</p>
        )}
      </div>

      <QuizConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onStart={handleConfiguredStart}
        quiz={quiz}
      />
    </div>
  );
}
