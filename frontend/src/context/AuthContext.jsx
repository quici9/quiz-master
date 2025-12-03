import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await authService.getMe();
                const { data } = response;
                setUser(data); // data is the user object directly
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.clear();
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        const { data } = response;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        return data.user;
    };

    const register = async (email, password, fullName) => {
        const response = await authService.register(email, password, fullName);
        const { data } = response;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };
    
    const updateProfile = async (userData) => {
        // Implement when API endpoint exists
        // const { data } = await api.patch('/users/me', userData);
        // setUser(data.data.user);
        // return data.data.user;
        console.warn('updateProfile not implemented yet');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
