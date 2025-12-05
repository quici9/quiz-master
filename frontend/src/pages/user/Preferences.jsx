import React, { useEffect, useState } from 'react';
import userService from '../../services/user.service';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { Cog6ToothIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function Preferences() {
    const { isDark, toggleDarkMode } = useDarkMode();
    const [preferences, setPreferences] = useState({
        darkMode: false,
        fontSize: 'medium',
        defaultShuffle: true,
        reviewMode: true,
        showExplanations: true,
        defaultQuestionCount: null,
        defaultShuffleQuestions: true,
        defaultShuffleOptions: false,
        emailReminders: true,
        browserNotify: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const res = await userService.getPreferences();
            setPreferences(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await userService.updatePreferences(preferences);
            toast.success('Preferences saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    const handleDarkModeToggle = () => {
        toggleDarkMode();
        setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loading size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400 rounded-xl">
                    <Cog6ToothIcon className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>

            {/* Appearance Section */}
            <Card className="p-6 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
                <div className="space-y-4">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-3">
                            {isDark ? (
                                <MoonIcon className="w-6 h-6 text-primary-400" />
                            ) : (
                                <SunIcon className="w-6 h-6 text-yellow-500" />
                            )}
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                                <div className="text-sm text-gray-500 dark:text-white/60">Toggle between light and dark themes</div>
                            </div>
                        </div>
                        <button
                            onClick={handleDarkModeToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-primary-500' : 'bg-gray-300 dark:bg-white/20'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Font Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            Font Size
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['small', 'medium', 'large'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setPreferences({ ...preferences, fontSize: size })}
                                    className={`p-3 rounded-lg border transition-all ${preferences.fontSize === size
                                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                                        : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Quiz Defaults Section */}
            <Card className="p-6 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quiz Defaults</h2>
                <div className="space-y-4">
                    {/* Default Question Count */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            Default Number of Questions
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={preferences.defaultQuestionCount || 20}
                            onChange={(e) =>
                                setPreferences({ ...preferences, defaultQuestionCount: parseInt(e.target.value) })
                            }
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                        <div className="flex justify-between text-sm text-gray-500 dark:text-white/60 mt-1">
                            <span>5</span>
                            <span className="text-primary-600 dark:text-primary-400 font-medium">
                                {preferences.defaultQuestionCount || 'Full Quiz'}
                            </span>
                            <span>50</span>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                            <span className="text-gray-700 dark:text-white/90">Shuffle Questions by Default</span>
                            <input
                                type="checkbox"
                                checked={preferences.defaultShuffleQuestions}
                                onChange={(e) =>
                                    setPreferences({ ...preferences, defaultShuffleQuestions: e.target.checked })
                                }
                                className="w-5 h-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary-500 focus:ring-primary-500/50"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                            <span className="text-gray-700 dark:text-white/90">Shuffle Options by Default</span>
                            <input
                                type="checkbox"
                                checked={preferences.defaultShuffleOptions}
                                onChange={(e) =>
                                    setPreferences({ ...preferences, defaultShuffleOptions: e.target.checked })
                                }
                                className="w-5 h-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary-500 focus:ring-primary-500/50"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                            <span className="text-gray-700 dark:text-white/90">Enable Review Mode by Default</span>
                            <input
                                type="checkbox"
                                checked={preferences.reviewMode}
                                onChange={(e) => setPreferences({ ...preferences, reviewMode: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary-500 focus:ring-primary-500/50"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                            <span className="text-gray-700 dark:text-white/90">Show Explanations</span>
                            <input
                                type="checkbox"
                                checked={preferences.showExplanations}
                                onChange={(e) =>
                                    setPreferences({ ...preferences, showExplanations: e.target.checked })
                                }
                                className="w-5 h-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary-500 focus:ring-primary-500/50"
                            />
                        </label>
                    </div>
                </div>
            </Card>

            {/* Notifications Section */}
            <Card className="p-6 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
                <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                        <div>
                            <div className="text-gray-700 dark:text-white/90">Email Reminders</div>
                            <div className="text-sm text-gray-500 dark:text-white/50">Receive reminder emails for practice</div>
                        </div>
                        <input
                            type="checkbox"
                            checked={preferences.emailReminders}
                            onChange={(e) =>
                                setPreferences({ ...preferences, emailReminders: e.target.checked })
                            }
                            className="w-5 h-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary-500 focus:ring-primary-500/50"
                        />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                        <div>
                            <div className="text-gray-700 dark:text-white/90">Browser Notifications</div>
                            <div className="text-sm text-gray-500 dark:text-white/50">Get notified in your browser</div>
                        </div>
                        <input
                            type="checkbox"
                            checked={preferences.browserNotify}
                            onChange={(e) =>
                                setPreferences({ ...preferences, browserNotify: e.target.checked })
                            }
                            className="w-5 h-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary-500 focus:ring-primary-500/50"
                        />
                    </label>
                </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} loading={saving} size="lg" className="px-8">
                    Save Preferences
                </Button>
            </div>
        </div>
    );
}
