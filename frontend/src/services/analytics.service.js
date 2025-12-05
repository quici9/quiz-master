import api from './api';

const analyticsService = {
  // Get performance by topic
  getTopicPerformance: async () => {
    return api.get('/analytics/topics');
  },

  // Get score trend over time
  getScoreTrend: async (days = 30) => {
    return api.get(`/analytics/trend?days=${days}`);
  },

  // Get weakest topics
  getWeakestTopics: async (limit = 3) => {
    return api.get(`/analytics/weakest?limit=${limit}`);
  },
};

export default analyticsService;
