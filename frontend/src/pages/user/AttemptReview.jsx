import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function AttemptReview() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const { data } = await api.get(`/attempts/${id}/review`);
                setData(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [id]);

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
    if (!data) return <div className="text-white text-center mt-10">Review not found</div>;

    const { attempt, answers } = data;

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Review: {attempt.quizTitle}</h1>
                    <Link to="/history" className="btn btn-secondary">Back to History</Link>
                </div>

                <div className="glass-card p-6 mb-8 flex justify-around text-white text-center">
                    <div>
                        <div className="text-3xl font-bold">{attempt.score}/{attempt.totalQuestions}</div>
                        <div className="text-sm opacity-70">Score</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">{Math.round((attempt.score / attempt.totalQuestions) * 100)}%</div>
                        <div className="text-sm opacity-70">Percentage</div>
                    </div>
                </div>

                <div className="space-y-6">
                    {answers.map((ans, idx) => (
                        <div key={ans.questionId} className={`glass-card p-6 border-l-8 ${ans.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                            <div className="flex justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Question {idx + 1}</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${ans.isCorrect ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                                    {ans.isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                            </div>

                            <p className="text-white text-lg mb-4">{ans.questionText}</p>

                            <div className="space-y-2">
                                <div className={`p-3 rounded-lg ${ans.isCorrect ? 'bg-green-500/30 border border-green-500' : 'bg-red-500/30 border border-red-500'}`}>
                                    <span className="font-bold text-white">Your Answer:</span>
                                    <span className="text-white ml-2">
                                        {ans.selectedOption ? `${ans.selectedOption.label}. ${ans.selectedOption.text}` : 'No answer'}
                                    </span>
                                </div>

                                {!ans.isCorrect && (
                                    <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50">
                                        <span className="font-bold text-green-200">Correct Answer:</span>
                                        <span className="text-green-100 ml-2">
                                            {ans.correctOption.label}. {ans.correctOption.text}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
