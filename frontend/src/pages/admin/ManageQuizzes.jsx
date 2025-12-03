import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (quiz) => {
    setDeleteModal({ show: true, quizId: quiz.id, title: quiz.title });
  };

  const confirmDelete = async () => {
    try {
      await adminService.deleteQuiz(deleteModal.quizId);
      toast.success('Quiz deleted successfully');
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to delete quiz');
    } finally {
      setDeleteModal({ show: false, quizId: null, title: '' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loading size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Manage Quizzes
        </h1>
        <Link to="/admin/upload">
          <Button variant="primary">
            <PlusIcon className="w-5 h-5 mr-1" />
            Upload New Quiz
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0 border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Questions
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{quiz.title}</div>
                      <div className="text-xs text-gray-400 line-clamp-1">{quiz.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                        {quiz.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {quiz.questionsCount || quiz.totalQuestions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(quiz.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/quizzes/${quiz.id}/edit`} className="text-primary-400 hover:text-primary-300 p-1 hover:bg-white/10 rounded transition-colors" title="Edit">
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <Link to={`/admin/quizzes/${quiz.id}/analytics`} className="text-blue-400 hover:text-blue-300 p-1 hover:bg-white/10 rounded transition-colors" title="Analytics">
                          <ChartBarIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(quiz)}
                          className="text-danger-400 hover:text-danger-300 p-1 hover:bg-white/10 rounded transition-colors"
                          title="Delete"
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
                    No quizzes found. Upload one to get started!
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
        title="Delete Quiz"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete "<strong>{deleteModal.title}</strong>"?
          </p>
          <p className="text-danger-200 bg-danger-500/10 border border-danger-500/20 p-4 rounded-xl text-sm">
            Warning: This action cannot be undone. All questions, options, and user attempts associated with this quiz will be permanently deleted.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal({ show: false, quizId: null, title: '' })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Quiz
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
