import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function QuizAnalytics() {
  const { id } = useParams();
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-6">
      <Link to="/admin/quizzes" className="flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        {t('analytics.back')}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h1>

      <Card className="p-12 text-center">
        <p className="text-gray-500">
          {t('analytics.comingSoon')}
        </p>
        <p className="mt-2 text-xs text-gray-400">Quiz ID: {id}</p>
      </Card>
    </div>
  );
}
