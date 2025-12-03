import api from './api';

const bookmarkService = {
  // Create bookmark
  createBookmark: async (data) => {
    return api.post('/bookmarks', data);
  },
  
  // Remove bookmark
  removeBookmark: async (bookmarkId) => {
    return api.delete(`/bookmarks/${bookmarkId}`);
  },
  
  // Get user's bookmarks
  getMyBookmarks: async (params) => {
    return api.get('/bookmarks/my', { params });
  },
};

export default bookmarkService;
