import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import attemptService from '../../services/attempt.service';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { ClockIcon, QuestionMarkCircleIcon, ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatDate';

export default function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAttempts, setUserAttempts] = useState([]);

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
      toast.error('Failed to load quiz details');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    const incompleteAttempt = userAttempts.find(a => a.status === 'IN_PROGRESS');

    if (incompleteAttempt) {
      if (window.confirm('You have an incomplete attempt. Do you want to resume it?')) {
        navigate(`/quiz/${id}/take?attemptId=${incompleteAttempt.id}`);
        return;
      }
    }

    navigate(`/quiz/${id}/take`);
  };

  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'badge badge-success';
      case 'MEDIUM':
        // Custom glass yellow since badge-warning is not in index.css
        return 'badge bg-yellow-500/20 text-yellow-200 border-yellow-500/30 border';
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
      <Link to="/quizzes" className="inline-flex items-center text-gray-400 hover:text-primary-300 transition-colors">
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        Back to Quizzes
      </Link>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 flex-grow">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
                <span className={getDifficultyBadgeClass(quiz.difficulty)}>
                  {quiz.difficulty}
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">{quiz.description}</p>
            </div>

            <div className="flex flex-wrap gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <QuestionMarkCircleIcon className="w-6 h-6 text-primary-400" />
                <span className="font-medium">{quiz.questionsCount || quiz.totalQuestions} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-primary-400" />
                <span className="font-medium">{quiz.timeLimit ? `${Math.ceil(quiz.timeLimit / 60)} mins` : 'No time limit'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-primary-400" />
                <span className="font-medium">Avg Score: {quiz.stats?.averageScore ? Math.round(quiz.stats.averageScore) : '--'}%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center min-w-[200px]">
            <Button size="lg" onClick={handleStartQuiz} className="w-full justify-center shadow-lg shadow-primary-500/20">
              Start Quiz
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white pl-1">Your Previous Attempts</h2>
        {userAttempts.length > 0 ? (
          <div className="space-y-3">
            {userAttempts.map(attempt => (
              <Card key={attempt.id} className="flex justify-between items-center py-4 px-6 hover:bg-white/5 transition-colors">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${attempt.score >= 70 ? 'text-success-400' : 'text-yellow-400'}`}>
                      {attempt.score !== null ? `${attempt.score}%` : 'In Progress'}
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-300">{formatDate(attempt.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {attempt.correctAnswers !== null ? `${attempt.correctAnswers}/${attempt.totalQuestions} correct` : 'Not completed'}
                  </p>
                </div>
                <Link to={attempt.status === 'COMPLETED' ? `/history/${attempt.id}` : `/quiz/${id}/take?attemptId=${attempt.id}`}>
                  <Button variant="secondary" size="sm">
                    {attempt.status === 'COMPLETED' ? 'Review' : 'Resume'}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic pl-1">You haven't taken this quiz yet.</p>
        )}
      </div>
    </div>
  );
}
