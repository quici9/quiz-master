import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import analyticsService from '../../services/analytics.service';
import quizService from '../../services/quiz.service';
import attemptService from '../../services/attempt.service';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { ChartBarIcon, BookOpenIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatRelativeTime } from '../../utils/formatDate';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    recentQuizzes: [],
    recentAttempts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch quizzes and attempts
      const [quizzesRes, attemptsRes] = await Promise.all([
        quizService.getQuizzes({ limit: 5 }).catch(() => ({ data: { quizzes: [] } })),
        attemptService.getMyAttempts({ limit: 5 }).catch(() => ({ data: { attempts: [], pagination: { total: 0 } } })),
      ]);

      // Calculate stats from attempts
      const allAttempts = attemptsRes.data?.attempts || [];
      const completedAttempts = allAttempts.filter(a => a.score !== null && a.score !== undefined);
      const totalAttempts = attemptsRes.data?.pagination?.total || allAttempts.length;
      const averageScore = completedAttempts.length > 0
        ? completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length
        : 0;

      setStats({
        totalAttempts,
        averageScore,
        recentQuizzes: quizzesRes.data?.quizzes || [],
        recentAttempts: allAttempts,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.fullName || 'User'}! 👋
        </h1>
        <Link to="/quizzes">
          <Button>Browse Quizzes</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="flex items-center p-4 md:p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200 mr-4">
            <BookOpenIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white/60 font-medium">Total Attempts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAttempts}</p>
          </div>
        </Card>

        <Card className="flex items-center p-4 md:p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
          <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-200 mr-4">
            <ChartBarIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white/60 font-medium">Average Score</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(stats.averageScore)}%</p>
          </div>
        </Card>

        <Card className="flex items-center p-4 md:p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-200 mr-4">
            <TrophyIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white/60 font-medium">Leaderboard Rank</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">#--</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Quizzes */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">New Quizzes</h2>
            <Link to="/quizzes" className="text-sm text-primary-600 hover:text-primary-700 dark:text-white/80 dark:hover:text-white">View All</Link>
          </div>
          <div className="space-y-4">
            {stats.recentQuizzes.length > 0 ? (
              stats.recentQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{quiz.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/70`}>
                          {quiz.questionsCount || quiz.totalQuestions || 0} Qs
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full 
                          ${quiz.difficulty === 'EASY' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200' :
                            quiz.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-200' :
                              'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200'}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                    <Link to={`/quizzes/${quiz.id}`}>
                      <Button size="sm" variant="secondary">Start</Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-8 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <p className="text-gray-500 dark:text-white/50">No quizzes available yet.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            <Link to="/history" className="text-sm text-primary-600 hover:text-primary-700 dark:text-white/80 dark:hover:text-white">View History</Link>
          </div>
          <div className="space-y-4">
            {stats.recentAttempts.length > 0 ? (
              stats.recentAttempts.map((attempt) => (
                <Card key={attempt.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{attempt.quiz?.title || 'Unknown Quiz'}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-white/60">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatRelativeTime(attempt.createdAt)}</span>
                        <span>•</span>
                        <span className={attempt.score >= 70 ? 'text-green-600 dark:text-green-300' : 'text-yellow-600 dark:text-yellow-300'}>
                          {attempt.score}%
                        </span>
                      </div>
                    </div>
                    <Link to={attempt.status === 'COMPLETED' ? `/history/${attempt.id}` : `/quiz/${attempt.quizId}/take`}>
                      <Button size="sm" variant="ghost">
                        {attempt.status === 'COMPLETED' ? 'Review' : 'Resume'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-8 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <p className="text-gray-500 dark:text-white/50">No recent activity.</p>
                <Link to="/quizzes">
                  <Button variant="ghost" className="mt-2">Start a Quiz</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
