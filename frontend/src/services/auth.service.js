import api from './api';

const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  register: async (email, password, fullName) => {
    return api.post('/auth/register', { email, password, fullName });
  },

  getMe: async () => {
    return api.get('/auth/me');
  },

  refreshToken: async (refreshToken) => {
    return api.post('/auth/refresh', { refreshToken });
  },

  logout: async () => {
    // Optional: Call backend to invalidate token
    // return api.post('/auth/logout');
  }
};

export default authService;

