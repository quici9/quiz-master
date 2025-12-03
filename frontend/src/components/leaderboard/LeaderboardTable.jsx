import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

export default function LeaderboardTable({ entries, currentUserId }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No leaderboard data available yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quizzes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.userId === currentUserId;
            
            return (
              <tr 
                key={entry.userId} 
                className={clsx(
                  isCurrentUser ? "bg-blue-50" : "hover:bg-gray-50"
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={clsx(
                    "flex items-center justify-center w-8 h-8 rounded-full font-bold",
                    rank === 1 ? "bg-yellow-100 text-yellow-700" :
                    rank === 2 ? "bg-gray-200 text-gray-700" :
                    rank === 3 ? "bg-orange-100 text-orange-800" :
                    "text-gray-500"
                  )}>
                    {rank}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {entry.avatarUrl ? (
                        <img src={entry.avatarUrl} alt="" className="h-8 w-8 rounded-full" />
                      ) : (
                        <UserIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className={clsx(
                        "text-sm font-medium",
                        isCurrentUser ? "text-blue-900" : "text-gray-900"
                      )}>
                        {entry.fullName}
                        {isCurrentUser && " (You)"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                  {Math.round(entry.averageScore)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {entry.totalQuizzes}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

