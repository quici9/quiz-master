import React, { useState } from 'react';
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function QuizConfigModal({ isOpen, onClose, onStart, quiz }) {
    // Ensure minimum 5 questions
    const maxQuestions = quiz.totalQuestions || quiz.questionsCount || 10;
    const defaultCount = Math.max(5, Math.min(maxQuestions, 20));

    const [config, setConfig] = useState({
        questionCount: defaultCount,
        shuffleQuestions: true,
        shuffleOptions: false,
        reviewMode: false,
    });

    if (!isOpen) return null;

    const handleStart = () => {
        const finalConfig = {
            questionCount: config.questionCount,
            shuffleQuestions: config.shuffleQuestions,
            shuffleOptions: config.shuffleOptions,
            reviewMode: config.reviewMode,
        };
        onStart(finalConfig);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="card w-full max-w-md relative animate-fade-in bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:text-white/60 dark:hover:text-white"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400 rounded-lg">
                        <Cog6ToothIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Configuration</h2>
                </div>

                <div className="space-y-6">
                    {/* Question Count */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            Number of Questions (Max: {maxQuestions})
                        </label>
                        <input
                            type="range"
                            min="5"
                            max={Math.max(5, maxQuestions)}
                            value={config.questionCount}
                            onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                        <div className="mt-2 text-right text-primary-600 dark:text-primary-400 font-medium">
                            {config.questionCount} Questions
                        </div>
                        {maxQuestions < 5 && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                                ⚠️ This quiz has fewer than 5 questions
                            </p>
                        )}
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                            <span className="text-gray-700 dark:text-white/90">Shuffle Questions</span>
                            <input
                                type="checkbox"
                                checked={config.shuffleQuestions}
                                onChange={(e) => setConfig({ ...config, shuffleQuestions: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary-500 focus:ring-primary-500/50"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                            <span className="text-gray-700 dark:text-white/90">Shuffle Options</span>
                            <input
                                type="checkbox"
                                checked={config.shuffleOptions}
                                onChange={(e) => setConfig({ ...config, shuffleOptions: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary-500 focus:ring-primary-500/50"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                            <div className="flex flex-col">
                                <span className="text-gray-700 dark:text-white/90">Review Mode (Instant Feedback)</span>
                                <span className="text-xs text-gray-500 dark:text-white/50 mt-0.5">See correct/incorrect answers immediately</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.reviewMode}
                                onChange={(e) => setConfig({ ...config, reviewMode: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary-500 focus:ring-primary-500/50"
                            />
                        </label>
                    </div>

                    <button
                        onClick={handleStart}
                        className="btn btn-primary w-full py-3"
                        disabled={maxQuestions < 5}
                    >
                        Start Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}
