import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import QuizCard from '../../components/quiz/QuizCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useDebounce } from '../../hooks/useDebounce';
import { FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    difficulty: searchParams.get('difficulty') || '',
    categoryId: searchParams.get('categoryId') || '',
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    fetchQuizzes();
  }, [debouncedSearch, filters.difficulty, filters.categoryId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzes({
        search: debouncedSearch,
        difficulty: filters.difficulty,
        categoryId: filters.categoryId,
      });
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };

      // Update URL params
      const params = new URLSearchParams(searchParams);
      if (value) params.set(key, value);
      else params.delete(key);
      setSearchParams(params);

      return newFilters;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Quizzes</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search quizzes..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="mb-0 w-full sm:w-64"
          />

          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="input w-full sm:w-40 bg-white dark:bg-white/5 text-gray-900 dark:text-white border-gray-200 dark:border-white/10"
          >
            <option value="" className="text-gray-900">All Difficulties</option>
            <option value="EASY" className="text-gray-900">Easy</option>
            <option value="MEDIUM" className="text-gray-900">Medium</option>
            <option value="HARD" className="text-gray-900">Hard</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : (
        <>
          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl border border-gray-200 dark:border-white/10">
              <FunnelIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-white/40" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No quizzes found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-white/60">
                Try adjusting your search or filters.
              </p>
              <div className="mt-6">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFilters({ search: '', difficulty: '', categoryId: '' });
                    setSearchParams({});
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
