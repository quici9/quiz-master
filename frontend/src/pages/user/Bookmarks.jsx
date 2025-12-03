import React, { useEffect, useState } from 'react';
import bookmarkService from '../../services/bookmark.service';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await bookmarkService.getMyBookmarks();
      setBookmarks(response.data.bookmarks || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await bookmarkService.removeBookmark(id);
      setBookmarks(prev => prev.filter(b => b.id !== id));
      toast.success('Bookmark removed');
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loading size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bookmarked Questions</h1>

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map(bookmark => (
            <Card key={bookmark.id} className="relative">
              <div className="pr-12">
                <p className="text-sm text-gray-500 mb-2 font-medium">
                  From: {bookmark.question?.quiz?.title || 'Unknown Quiz'}
                </p>
                <h3 className="text-lg text-gray-900 font-medium mb-3">
                  {bookmark.question?.text}
                </h3>
                <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                   {bookmark.question?.options?.map(opt => (
                       <div key={opt.id} className={`text-sm ${opt.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                           {opt.isCorrect && '✓ '} {opt.text}
                       </div>
                   ))}
                </div>
              </div>
              <button
                onClick={() => handleRemove(bookmark.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2"
                title="Remove bookmark"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-500">No bookmarks yet.</p>
        </Card>
      )}
    </div>
  );
}
