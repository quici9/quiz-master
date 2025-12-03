import React from 'react';

export const QuizCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
    <div className="flex gap-2 mb-4">
      <div className="h-5 bg-gray-200 rounded w-16" />
      <div className="h-5 bg-gray-200 rounded w-16" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />
    <div className="h-10 bg-gray-200 rounded w-full" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-4" />
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-200 rounded mb-2" />
    ))}
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
      </div>
    ))}
  </div>
);

export default {
  QuizCardSkeleton,
  TableSkeleton,
  StatsSkeleton,
};

