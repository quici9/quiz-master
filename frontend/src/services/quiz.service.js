import api from './api';

const quizService = {
  // Get all quizzes with filters
  getQuizzes: async (params) => {
    return api.get('/quizzes', { params });
  },
  
  // Get quiz by ID
  getQuizById: async (id) => {
    return api.get(`/quizzes/${id}`);
  },
};

export default quizService;
