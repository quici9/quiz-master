import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import quizService from '../../services/quiz.service';
import adminService from '../../services/admin.service';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, ChartBarIcon, PlusIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatDate';

export default function ManageQuizzes() {
  const { t } = useTranslation('admin');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, quizId: null, title: '' });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzes({ limit: 100 }); // Fetch all for now
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error(error);
      toast.error(t('manage.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (quiz) => {
    setDeleteModal({ show: true, quizId: quiz.id, title: quiz.title });
  };

  const confirmDelete = async () => {
    const quizId = deleteModal.quizId;

    try {
      // Immediately remove from UI for instant feedback
      setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.id !== quizId));

      // Close modal first
      setDeleteModal({ show: false, quizId: null, title: '' });

      // Delete from backend
      await adminService.deleteQuiz(quizId);
      toast.success(t('manage.deleteSuccess'));

      // Force refresh with cache-busting to bypass stale cache
      // Add timestamp to ensure fresh data
      const timestamp = Date.now();
      const response = await quizService.getQuizzes({ limit: 100, _t: timestamp });
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      // On error, refresh to get accurate list
      toast.error(t('manage.deleteFailed'));
      fetchQuizzes();
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loading size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          {t('manage.title')}
        </h1>
        <Link to="/admin/upload">
          <Button variant="primary">
            <PlusIcon className="w-5 h-5 mr-1" />
            {t('manage.uploadNew')}
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('manage.table.title')}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('manage.table.category')}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('manage.table.questions')}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('manage.table.created')}
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('manage.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{quiz.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{quiz.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs">
                        {quiz.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {quiz.questionsCount || quiz.totalQuestions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(quiz.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/quizzes/${quiz.id}/edit`} className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors" title={t('manage.actions.edit')}>
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <Link to={`/admin/quizzes/${quiz.id}/analytics`} className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors" title={t('manage.actions.analytics')}>
                          <ChartBarIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(quiz)}
                          className="text-danger-600 hover:text-danger-500 dark:text-danger-400 dark:hover:text-danger-300 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                          title={t('manage.actions.delete')}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {t('manage.emptyState')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, quizId: null, title: '' })}
        title={t('manage.modal.deleteTitle')}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            <Trans
              i18nKey="manage.modal.confirmMessage"
              ns="admin"
              values={{ title: deleteModal.title }}
              components={{ 1: <strong /> }}
            />
          </p>
          <p className="text-danger-700 bg-danger-50 border border-danger-200 dark:text-danger-200 dark:bg-danger-500/10 dark:border-danger-500/20 p-4 rounded-xl text-sm">
            {t('manage.modal.warningMessage')}
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal({ show: false, quizId: null, title: '' })}>
              {t('manage.modal.cancel')}
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              {t('manage.modal.confirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
