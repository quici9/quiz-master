import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

export default function ScoreDisplay({ score, correctAnswers, totalQuestions }) {
  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A', stars: 5, color: 'text-green-400', text: 'Excellent!' };
    if (score >= 80) return { grade: 'B', stars: 4, color: 'text-blue-400', text: 'Great Job!' };
    if (score >= 70) return { grade: 'C', stars: 3, color: 'text-yellow-400', text: 'Good Effort' };
    if (score >= 60) return { grade: 'D', stars: 2, color: 'text-orange-400', text: 'Needs Improvement' };
    return { grade: 'F', stars: 1, color: 'text-red-400', text: 'Keep Practicing' };
  };

  const { grade, stars, color, text } = getGrade(score);

  return (
    <div className="flex flex-col items-center p-8 glass rounded-2xl">
      <div className={`text-7xl font-bold mb-4 drop-shadow-lg ${color}`}>
        {Math.round(score)}%
      </div>

      <div className="flex gap-2 mb-6">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-10 h-10 drop-shadow-md ${i < stars ? 'text-yellow-400' : 'text-white/10'}`}
          />
        ))}
      </div>

      <h2 className="text-3xl font-bold text-white mb-2">{text}</h2>
      <p className="text-white/60 mb-8 text-lg">
        You got <span className="font-bold text-white">{correctAnswers}</span> out of <span className="font-bold text-white">{totalQuestions}</span> questions correct.
      </p>

      <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
        <div
          className={`h-full shadow-lg ${score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
