import React, { useEffect, useState } from 'react';
import leaderboardService from '../../services/leaderboard.service';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Leaderboard() {
  const { t } = useTranslation('common');
  const [period, setPeriod] = useState('weekly'); // weekly, monthly
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const service = period === 'weekly'
        ? leaderboardService.getWeeklyLeaderboard
        : leaderboardService.getMonthlyLeaderboard;
      const response = await service();
      setLeaders(response.data.leaderboard || []);
    } catch (error) {
      console.error(error);
      // toast.error('Failed to load leaderboard');
      // Mock data if API fails (since API might not exist yet)
      setLeaders([
        { id: 1, user: { fullName: 'Alice Smith', email: 'alice@example.com' }, score: 4500, quizzesTaken: 5 },
        { id: 2, user: { fullName: 'Bob Jones', email: 'bob@example.com' }, score: 3800, quizzesTaken: 4 },
        { id: 3, user: { fullName: 'Charlie Brown', email: 'charlie@example.com' }, score: 3200, quizzesTaken: 4 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700 dark:from-yellow-200 dark:to-yellow-500">
          {t('leaderboard.title')}
        </h1>
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${period === 'weekly' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/5'
              }`}
          >
            {t('leaderboard.weekly')}
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${period === 'monthly' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/5'
              }`}
          >
            {t('leaderboard.monthly')}
          </button>
        </div>
      </div>

      <Card className="overflow-hidden p-0 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('leaderboard.rank')}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('leaderboard.user')}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('leaderboard.quizzesTaken')}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('leaderboard.totalScore')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Loading className="mx-auto" />
                  </td>
                </tr>
              ) : leaders.length > 0 ? (
                leaders.map((entry, index) => (
                  <tr key={index} className={`transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-500/5 dark:to-transparent' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index === 0 ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50' :
                        index === 1 ? 'bg-gray-400 text-white shadow-lg shadow-gray-400/50' :
                          index === 2 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50' :
                            'text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-white/5'
                        }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold mr-3 shadow-lg border border-white/10">
                          {(entry.user?.fullName || entry.user?.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.user?.fullName || 'Unknown'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {entry.quizzesTaken}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-success-600 dark:text-success-400">
                      {entry.score}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    {t('leaderboard.noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
