import api from './api';

const questionService = {
  // Get questions for a quiz
  getQuestionsByQuiz: async (quizId, params = {}) => {
    return api.get(`/questions/quiz/${quizId}`, { params });
  },

  // Get questions for a specific attempt (respects selectedQuestions)
  getQuestionsByAttempt: async (attemptId, params = {}) => {
    return api.get(`/questions/attempt/${attemptId}`, { params });
  },
};

export default questionService;
