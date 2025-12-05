import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import attemptService from '../../services/attempt.service';
import bookmarkService from '../../services/bookmark.service';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

export default function HistoryDetail() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, correct, incorrect

  useEffect(() => {
    fetchReview();
  }, [attemptId]);

  const fetchReview = async () => {
    setLoading(true);
    try {
      const response = await attemptService.getAttemptReview(attemptId);
      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load review');
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (questionId) => {
    try {
      await bookmarkService.createBookmark({ questionId });
      toast.success('Question bookmarked');
    } catch (error) {
      toast.error('Could not bookmark');
    }
  };

  const filteredAnswers = useMemo(() => {
    if (!data) return [];
    if (filter === 'correct') return data.answers.filter(a => a.isCorrect);
    if (filter === 'incorrect') return data.answers.filter(a => !a.isCorrect);
    return data.answers;
  }, [data, filter]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const { attempt } = data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/history" className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to History
        </Link>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Attempted on {new Date(attempt.createdAt).toLocaleDateString()}
        </div>
      </div>

      <Card className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{attempt.quiz?.title} Review</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Score: <span className={`font-bold ${attempt.score >= 70 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>{attempt.score}%</span>
              <span className="mx-2">•</span>
              ({attempt.correctAnswers}/{attempt.totalQuestions} correct)
            </p>
          </div>
          <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-white/10">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'correct' ? 'bg-success-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'}`}
            >
              Correct
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'incorrect' ? 'bg-danger-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'}`}
            >
              Incorrect
            </button>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {filteredAnswers.map((answer, index) => (
          <div key={answer.questionId} className={`glass rounded-2xl p-6 border-l-4 border-gray-200 dark:border-white/10 ${answer.isCorrect ? 'border-l-success-500' : 'border-l-danger-500'}`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex gap-3">
                <span className="font-bold text-gray-400 dark:text-gray-500">Q{index + 1}.</span>
                <span>{answer.questionText}</span>
              </h3>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                {answer.isCorrect ? (
                  <CheckCircleIcon className="w-8 h-8 text-success-500" />
                ) : (
                  <XCircleIcon className="w-8 h-8 text-danger-500" />
                )}
                <button onClick={() => handleBookmark(answer.questionId)} className="text-gray-400 dark:text-gray-500 hover:text-yellow-400 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                  <BookmarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className={`p-4 rounded-xl border ${answer.isCorrect ? 'bg-success-50 border-success-200 dark:bg-success-500/10 dark:border-success-500/20' : 'bg-danger-50 border-danger-200 dark:bg-danger-500/10 dark:border-danger-500/20'}`}>
                <span className={`font-bold text-xs uppercase tracking-wider block mb-1 ${answer.isCorrect ? 'text-success-700 dark:text-success-400' : 'text-danger-700 dark:text-danger-400'}`}>Your Answer</span>
                <p className="text-gray-900 dark:text-white">{answer.selectedOption?.text || 'No answer selected'}</p>
              </div>

              {!answer.isCorrect && (
                <div className="p-4 rounded-xl border bg-success-50 border-success-200 dark:bg-success-500/10 dark:border-success-500/20">
                  <span className="font-bold text-xs uppercase tracking-wider text-success-700 dark:text-success-400 block mb-1">Correct Answer</span>
                  <p className="text-gray-900 dark:text-white">{answer.correctOption?.text}</p>
                </div>
              )}
            </div>

            {/* Explanation if available */}
            {answer.correctOption?.explanation && (
              <div className="mt-4 p-4 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 rounded-xl border text-sm">
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1 flex items-center gap-2">
                  <span>💡</span> Explanation
                </span>
                <p className="text-blue-800 dark:text-blue-100/90">{answer.correctOption.explanation}</p>
              </div>
            )}
          </div>
        ))}

        {filteredAnswers.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-500 glass rounded-2xl border border-gray-200 dark:border-white/10">
            No questions found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
