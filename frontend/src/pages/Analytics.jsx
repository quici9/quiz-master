import React, { useState, useEffect } from 'react';
import analytics from '../services/analytics.service';
import { useTheme } from '../context/ThemeContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Analytics() {
    const [topicPerformance, setTopicPerformance] = useState([]);
    const [scoreTrend, setScoreTrend] = useState([]);
    const [weakestTopics, setWeakestTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [topicsRes, trendRes, weakRes] = await Promise.all([
                    analytics.getTopicPerformance(),
                    analytics.getScoreTrend(),
                    analytics.getWeakestTopics()
                ]);
                setTopicPerformance(topicsRes.data);
                setScoreTrend(trendRes.data);
                setWeakestTopics(weakRes.data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-white">Loading analytics...</div>;

    const barData = {
        labels: topicPerformance.map(t => t.topic),
        datasets: [
            {
                label: 'Accuracy (%)',
                data: topicPerformance.map(t => t.accuracy),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };

    const lineData = {
        labels: scoreTrend.map(t => new Date(t.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Score Trend',
                data: scoreTrend.map(t => t.percentage),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: isDark ? '#fff' : '#374151' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                ticks: { color: isDark ? '#fff' : '#374151' }
            },
            x: {
                grid: { color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                ticks: { color: isDark ? '#fff' : '#374151' }
            }
        },
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Performance Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Topic Performance */}
                <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Topic Performance</h2>
                    <Bar data={barData} options={options} />
                </div>

                {/* Score Trend */}
                <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Score Trend (Last 30 Days)</h2>
                    <Line data={lineData} options={options} />
                </div>
            </div>

            {/* Weakest Topics */}
            <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Areas for Improvement</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {weakestTopics.map((topic, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-danger-50 border border-danger-200 dark:bg-danger-500/10 dark:border-danger-500/20">
                            <h3 className="font-medium text-danger-700 dark:text-danger-300 mb-2">{topic.topic}</h3>
                            <div className="flex justify-between text-sm text-gray-500 dark:text-white/60">
                                <span>Accuracy</span>
                                <span className="text-gray-900 dark:text-white">{topic.accuracy}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 mt-2">
                                <div
                                    className="bg-danger-500 h-1.5 rounded-full"
                                    style={{ width: `${topic.accuracy}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {weakestTopics.length === 0 && (
                        <p className="text-gray-500 dark:text-white/60 col-span-3 text-center py-4">
                            Not enough data to identify weak topics yet. Keep practicing!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
