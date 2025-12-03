import api from './api';

const attemptService = {
  // Start new attempt
  startAttempt: async (data) => {
    return api.post('/attempts/start', data);
  },
  
  // Save answer for a question
  answerQuestion: async (attemptId, data) => {
    return api.post(`/attempts/${attemptId}/answer`, data);
  },
  
  // Submit attempt
  submitAttempt: async (attemptId, data) => {
    return api.post(`/attempts/${attemptId}/submit`, data);
  },
  
  // Get user's attempts
  getMyAttempts: async (params) => {
    return api.get('/attempts/my', { params });
  },
  
  // Get attempt by ID
  getAttemptById: async (attemptId) => {
    return api.get(`/attempts/${attemptId}`);
  },
  
  // Get attempt review (with correct answers)
  getAttemptReview: async (attemptId) => {
    return api.get(`/attempts/${attemptId}/review`);
  },
  
  // Pause attempt
  pauseAttempt: async (attemptId) => {
    return api.post(`/attempts/${attemptId}/pause`);
  },
  
  // Resume attempt
  resumeAttempt: async (attemptId) => {
    return api.post(`/attempts/${attemptId}/resume`);
  },
  
  // Track tab switch
  trackTabSwitch: async (attemptId) => {
    return api.post(`/attempts/${attemptId}/tab-switch`);
  },
};

export default attemptService;
