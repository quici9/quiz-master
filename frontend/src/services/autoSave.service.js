import api from './api';

export const saveProgress = async (attemptId, progress) => {
    return api.post(`/attempts/${attemptId}/autosave`, progress);
};

export const getProgress = async (attemptId) => {
    return api.get(`/attempts/${attemptId}/autosave`);
};

export const clearProgress = async (attemptId) => {
    return api.delete(`/attempts/${attemptId}/autosave`);
};
