import React, { useEffect, useState } from 'react';
import attemptService from '../../services/attempt.service';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch all attempts to calculate stats
      const response = await attemptService.getMyAttempts({ limit: 100 });
      const attempts = response.data?.attempts || [];

      const completedAttempts = attempts.filter(a => a.status === 'COMPLETED');
      const totalAttempts = attempts.length;
      const averageScore = completedAttempts.length > 0
        ? completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length
        : 0;
      const totalTimeSpent = completedAttempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0);

      setStats({
        totalAttempts,
        averageScore,
        completedQuizzes: completedAttempts.length,
        totalTimeSpent,
      });
    } catch (error) {
      console.error(error);
      setStats({
        totalAttempts: 0,
        averageScore: 0,
        completedQuizzes: 0,
        totalTimeSpent: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loading size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Total Attempts</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalAttempts || 0}</p>
        </Card>
        <Card className="p-6 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Average Score</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{Math.round(stats?.averageScore || 0)}%</p>
        </Card>
        <Card className="p-6 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Quizzes Completed</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats?.completedQuizzes || 0}</p>
        </Card>
        <Card className="p-6 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Time Spent</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{Math.round((stats?.totalTimeSpent || 0) / 60)}m</p>
        </Card>
      </div>

      <Card className="p-8 text-center text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
        <ChartBarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
        <p>Detailed charts and graphs coming soon!</p>
      </Card>
    </div>
  );
}
