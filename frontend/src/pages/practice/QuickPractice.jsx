import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PlayIcon, BoltIcon } from '@heroicons/react/24/outline';

export default function QuickPractice() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [config, setConfig] = useState({
        count: 10,
        categoryId: '',
        difficulty: ''
    });

    useEffect(() => {
        // Fetch categories
        api.get('/categories').then(res => setCategories(res.data));
    }, []);

    const handleStart = async () => {
        try {
            setLoading(true);
            const res = await api.post('/practice/quick', config);
            navigate(`/practice/${res.data.practiceId}`, {
                state: {
                    questions: res.data.questions,
                    mode: 'QUICK'
                }
            });
        } catch (error) {
            console.error('Failed to start practice:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400 rounded-xl">
                            <BoltIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Practice</h1>
                            <p className="text-gray-500 dark:text-white/60">Practice random questions to test your knowledge</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Question Count */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                                Number of Questions
                            </label>
                            <div className="flex gap-4">
                                {[5, 10, 20, 50].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setConfig({ ...config, count: num })}
                                        className={`flex-1 py-2 rounded-lg border transition-all ${config.count === num
                                            ? 'bg-primary-600 border-primary-500 text-white'
                                            : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-white/70'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                                Category (Optional)
                            </label>
                            <select
                                value={config.categoryId}
                                onChange={(e) => setConfig({ ...config, categoryId: e.target.value })}
                                className="input w-full bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                            >
                                <option value="" className="text-gray-500">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="text-gray-900 dark:text-white dark:bg-slate-800">{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                                Difficulty (Optional)
                            </label>
                            <div className="flex gap-4">
                                {['EASY', 'MEDIUM', 'HARD'].map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => setConfig({
                                            ...config,
                                            difficulty: config.difficulty === diff ? '' : diff
                                        })}
                                        className={`flex-1 py-2 rounded-lg border transition-all ${config.difficulty === diff
                                            ? 'bg-primary-600 border-primary-500 text-white'
                                            : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-white/70'
                                            }`}
                                    >
                                        {diff || 'Any'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            disabled={loading}
                            className="btn btn-primary w-full py-3 text-lg"
                        >
                            {loading ? 'Starting...' : 'Start Practice'}
                            {!loading && <PlayIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
