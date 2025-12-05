import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { BookmarkIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function BookmarkedPractice() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(10);

    const handleStart = async () => {
        try {
            setLoading(true);
            const res = await api.post('/practice/bookmarked', { count });
            navigate(`/practice/${res.data.practiceId}`, {
                state: {
                    questions: res.data.questions,
                    mode: 'BOOKMARKED'
                }
            });
        } catch (error) {
            console.error('Failed to start practice:', error);
            // Handle error (e.g. show toast if no bookmarks)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 rounded-xl">
                            <BookmarkIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookmarked Questions</h1>
                            <p className="text-gray-500 dark:text-white/60">Review questions you've saved for later</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                                Number of Questions
                            </label>
                            <div className="flex gap-4">
                                {[5, 10, 20, 50].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setCount(num)}
                                        className={`flex-1 py-2 rounded-lg border transition-all ${count === num
                                            ? 'bg-yellow-600 border-yellow-500 text-white'
                                            : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-white/70'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            disabled={loading}
                            className="btn btn-primary w-full py-3 text-lg bg-yellow-600 hover:bg-yellow-700 border-yellow-500/30 text-white"
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
