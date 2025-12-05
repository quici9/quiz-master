import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { XCircleIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function WrongQuestionsPractice() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(10);

    const handleStart = async () => {
        try {
            setLoading(true);
            const res = await api.post('/practice/wrong', { count });
            navigate(`/practice/${res.data.practiceId}`, {
                state: {
                    questions: res.data.questions,
                    mode: 'WRONG_QUESTIONS'
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
                        <div className="p-3 bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400 rounded-xl">
                            <XCircleIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wrong Questions</h1>
                            <p className="text-gray-500 dark:text-white/60">Master questions you've missed in the past</p>
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
                                            ? 'bg-danger-600 border-danger-500 text-white'
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
                            className="btn btn-danger w-full py-3 text-lg"
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
