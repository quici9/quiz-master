import api from './api';

const analyticsService = {
  // Get user statistics
  getUserStats: async () => {
    return api.get('/analytics/users/me/stats');
  },
  
  // Get quiz analytics (admin only)
  getQuizAnalytics: async (quizId) => {
    return api.get(`/analytics/quizzes/${quizId}/stats`);
  },
};

export default analyticsService;
