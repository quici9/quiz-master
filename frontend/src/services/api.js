import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor - add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    { refreshToken }
                );

                localStorage.setItem('accessToken', data.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

                return api(originalRequest);
            } catch (err) {
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export { api };
export default api;
