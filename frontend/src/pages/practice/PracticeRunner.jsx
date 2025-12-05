import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CheckCircleIcon, XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function PracticeRunner() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState(location.state?.questions || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!questions.length) {
            // Fetch session if not passed in state
            api.get(`/practice/${id}`).then(res => {
                setQuestions(res.data.questions);
            }).catch(() => navigate('/quizzes'));
        }
    }, [id, questions.length, navigate]);

    const currentQuestion = questions[currentIndex];

    const handleAnswer = (optionId) => {
        if (showResult) return;
        setSelectedOption(optionId);
        setShowResult(true);

        const isCorrect = currentQuestion.options.find(o => o.id === optionId)?.isCorrect;
        if (isCorrect) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            setSelectedOption(null);
            setShowResult(false);
        } else {
            setIsFinished(true);
        }
    };

    if (!currentQuestion) return <div>Loading...</div>;

    if (isFinished) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto card text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Practice Complete!</h2>
                    <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-6">
                        {Math.round((score / questions.length) * 100)}%
                    </div>
                    <p className="text-gray-500 dark:text-white/60 mb-8">
                        You got {score} out of {questions.length} questions correct.
                    </p>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="btn btn-primary"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-white/60 mb-2">
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-500 transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        {currentQuestion.text}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map(option => {
                            let className = "w-full p-4 rounded-xl border text-left transition-all ";

                            if (showResult) {
                                if (option.isCorrect) {
                                    className += "bg-success-100 border-success-500 text-success-900 dark:bg-success-500/20 dark:border-success-500 dark:text-white";
                                } else if (selectedOption === option.id) {
                                    className += "bg-danger-100 border-danger-500 text-danger-900 dark:bg-danger-500/20 dark:border-danger-500 dark:text-white";
                                } else {
                                    className += "border-gray-200 dark:border-white/10 opacity-50";
                                }
                            } else {
                                className += selectedOption === option.id
                                    ? "bg-primary-100 border-primary-500 text-primary-900 dark:bg-primary-500/20 dark:border-primary-500 dark:text-white"
                                    : "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white";
                            }

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswer(option.id)}
                                    disabled={showResult}
                                    className={className}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option.text}</span>
                                        {showResult && option.isCorrect && (
                                            <CheckCircleIcon className="w-6 h-6 text-success-600 dark:text-success-400" />
                                        )}
                                        {showResult && selectedOption === option.id && !option.isCorrect && (
                                            <XCircleIcon className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation & Next Button */}
                    {showResult && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10 animate-fade-in">
                            {currentQuestion.options.find(o => o.isCorrect)?.explanation && (
                                <div className="mb-6 p-4 rounded-lg bg-primary-50 border border-primary-200 dark:bg-primary-500/10 dark:border-primary-500/20">
                                    <h4 className="font-medium text-primary-700 dark:text-primary-300 mb-1">Explanation</h4>
                                    <p className="text-gray-700 dark:text-white/80 text-sm">
                                        {currentQuestion.options.find(o => o.isCorrect).explanation}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    onClick={handleNext}
                                    className="btn btn-primary"
                                >
                                    {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
