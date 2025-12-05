import React from 'react';

export default function Timer({ timeElapsed, timeLimit }) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const remaining = timeLimit ? timeLimit - timeElapsed : null;
  const isUrgent = remaining !== null && remaining < 300; // Less than 5 mins

  return (
    <div className={`font-mono font-bold text-lg flex items-center gap-2 px-4 py-2 rounded-lg glass border border-gray-200 dark:border-white/10
      ${isUrgent ? 'text-red-600 dark:text-red-400 animate-pulse border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10' : 'text-gray-900 dark:text-white'}
    `}>
      <span>⏱️</span>
      {remaining !== null ? (
        <span>{formatTime(remaining)}</span>
      ) : (
        <span>{formatTime(timeElapsed)}</span>
      )}
    </div>
  );
}
