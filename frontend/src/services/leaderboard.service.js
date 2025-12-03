import api from './api';

const leaderboardService = {
  // Get weekly leaderboard
  getWeeklyLeaderboard: async () => {
    return api.get('/leaderboard/weekly');
  },
  
  // Get monthly leaderboard
  getMonthlyLeaderboard: async () => {
    return api.get('/leaderboard/monthly');
  },
};

export default leaderboardService;
