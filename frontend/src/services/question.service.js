import api from './api';

const questionService = {
  // Get questions for a quiz
  getQuestionsByQuiz: async (quizId, params = {}) => {
    return api.get(`/questions/quiz/${quizId}`, { params });
  },
};

export default questionService;
