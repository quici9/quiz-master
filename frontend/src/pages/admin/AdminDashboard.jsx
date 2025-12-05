import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CloudArrowUpIcon, DocumentDuplicateIcon, ChartPieIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { t } = useTranslation('admin');
  const adminLinks = [
    {
      title: t('upload.title'),
      description: t('dashboard.links.uploadDesc'),
      icon: CloudArrowUpIcon,
      to: '/admin/upload',
      color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
    },
    {
      title: t('manage.title'),
      description: t('dashboard.links.manageDesc'),
      icon: DocumentDuplicateIcon,
      to: '/admin/quizzes',
      color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
    },
    {
      title: t('analytics.title'),
      description: t('dashboard.links.analyticsDesc'),
      icon: ChartPieIcon,
      to: '/admin/quizzes', // Redirect to manage for now
      color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminLinks.map((link) => (
          <Link key={link.title} to={link.to} className="block group">
            <Card className="h-full hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 border-gray-200 dark:border-white/10 group-hover:scale-[1.02] group-hover:shadow-xl bg-white dark:bg-white/5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border backdrop-blur-sm transition-transform group-hover:scale-110 duration-300 ${link.color}`}>
                <link.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {link.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {link.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
