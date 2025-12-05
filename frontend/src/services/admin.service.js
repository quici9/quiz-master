import api from './api';

const adminService = {
  // Import quiz from Word file
  importQuiz: async (formData, config = {}) => {
    return api.post('/quizzes/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });
  },

  // Get job status
  getJobStatus: async (jobId) => {
    return api.get(`/jobs/${jobId}`);
  },

  // Update quiz
  updateQuiz: async (quizId, data) => {
    return api.patch(`/quizzes/${quizId}`, data);
  },

  // Delete quiz
  deleteQuiz: async (quizId) => {
    return api.delete(`/quizzes/${quizId}`);
  },
};

export default adminService;
