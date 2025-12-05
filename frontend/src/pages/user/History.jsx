import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import attemptService from '../../services/attempt.service';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await attemptService.getMyAttempts();
      setAttempts(response.data.attempts || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        My Quiz History
      </h1>

      {attempts.length > 0 ? (
        <div className="space-y-4">
          {attempts.map(attempt => (
            <Card key={attempt.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{attempt.quiz?.title || 'Unknown Quiz'}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(attempt.createdAt)}</span>
                    <span>•</span>
                    <span className={`font-medium ${attempt.status === 'COMPLETED' ? 'text-success-600 dark:text-success-400' : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                      {attempt.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  {attempt.status === 'COMPLETED' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
                      <p className={`text-xl font-bold ${attempt.score >= 70 ? 'text-success-600 dark:text-success-400' : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                        {attempt.score}%
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {attempt.status === 'COMPLETED' ? (
                      <Link to={`/history/${attempt.id}`}>
                        <Button variant="secondary" size="sm">Review</Button>
                      </Link>
                    ) : (
                      <Link to={`/quiz/${attempt.quizId}/take?attemptId=${attempt.id}`}>
                        <Button variant="primary" size="sm">Resume</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't taken any quizzes yet.</p>
          <Link to="/quizzes">
            <Button variant="primary">Browse Quizzes</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
