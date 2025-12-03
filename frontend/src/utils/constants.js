export const DIFFICULTY_COLORS = {
  EASY: 'text-green-600 bg-green-50',
  MEDIUM: 'text-yellow-600 bg-yellow-50',
  HARD: 'text-red-600 bg-red-50',
};

export const DIFFICULTY_LABELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export const GRADE_CONFIG = {
  A: { min: 90, color: 'text-green-600', stars: 5 },
  B: { min: 80, color: 'text-blue-600', stars: 4 },
  C: { min: 70, color: 'text-yellow-600', stars: 3 },
  D: { min: 60, color: 'text-orange-600', stars: 2 },
  F: { min: 0, color: 'text-red-600', stars: 1 },
};

export const STATUS_LABELS = {
  IN_PROGRESS: 'In Progress',
  PAUSED: 'Paused',
  COMPLETED: 'Completed',
  ABANDONED: 'Abandoned',
};

export const STATUS_COLORS = {
  IN_PROGRESS: 'text-blue-600 bg-blue-50',
  PAUSED: 'text-yellow-600 bg-yellow-50',
  COMPLETED: 'text-green-600 bg-green-50',
  ABANDONED: 'text-gray-600 bg-gray-50',
};
