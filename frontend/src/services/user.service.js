import { api } from './api';

const getProfile = () => api.get('/users/me');

const updateProfile = (data) => api.patch('/users/me', data);

const changePassword = (data) => api.post('/users/me/change-password', data);

const getPreferences = () => api.get('/users/me/preferences');

const updatePreferences = (data) => api.patch('/users/me/preferences', data);

export default {
    getProfile,
    updateProfile,
    changePassword,
    getPreferences,
    updatePreferences,
};
