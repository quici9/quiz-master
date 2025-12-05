import { useTheme } from '../context/ThemeContext';

export const useDarkMode = () => {
    const context = useTheme();
    if (!context) {
        throw new Error('useDarkMode must be used within a ThemeProvider');
    }
    const { theme, toggleTheme } = context;

    return {
        isDark: theme === 'dark',
        toggleDarkMode: toggleTheme
    };
};
