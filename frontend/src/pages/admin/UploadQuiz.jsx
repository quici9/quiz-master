import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin.service';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api'; // Direct api access for categories if needed, or create categoryService

export default function UploadQuiz() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]); // Fetch categories
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [isDragging, setIsDragging] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => {
      try {

        const res = await api.get('/categories');

        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.docx')) {
      setError('Only .docx files are supported');
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.categoryId || !file) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('categoryId', formData.categoryId);

    try {

      const response = await adminService.importQuiz(data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });


      const stats = response.data.stats || { questionsCreated: 0, optionsCreated: 0, totalParsed: 0, errors: [] };

      setResult(stats);
      toast.success('Quiz uploaded successfully!');
      setUploading(false);
      // No auto-redirect
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.error?.message || 'Failed to upload quiz');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (result) {

    const hasErrors = Array.isArray(result.errors) && result.errors.length > 0;


    return (
      <Card className="max-w-2xl mx-auto text-center py-12 border-white/10">
        <div className="w-20 h-20 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-success-400 border border-success-500/30 shadow-lg shadow-success-500/10">
          <CheckCircleIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Upload Successful!</h2>

        <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Total Parsed</p>
            <p className="text-2xl font-bold text-white">{result.totalParsed || 0}</p>
          </div>
          <div className="bg-success-500/10 p-4 rounded-xl border border-success-500/20">
            <p className="text-success-400 text-sm">Success</p>
            <p className="text-2xl font-bold text-success-400">{result.questionsCreated || 0}</p>
          </div>
          <div className={`p-4 rounded-xl border ${hasErrors ? 'bg-danger-500/10 border-danger-500/20' : 'bg-white/5 border-white/10'}`}>
            <p className={`${hasErrors ? 'text-danger-400' : 'text-gray-400'} text-sm`}>Failed</p>
            <p className={`text-2xl font-bold ${hasErrors ? 'text-danger-400' : 'text-white'}`}>
              {(result.totalParsed || 0) - (result.questionsCreated || 0)}
            </p>
          </div>
        </div>

        {hasErrors && (
          <div className="mb-8 text-left bg-danger-500/5 border border-danger-500/20 rounded-xl p-6 max-w-lg mx-auto">
            <h3 className="text-danger-400 font-bold mb-3 flex items-center gap-2">
              <span>⚠️</span> Import Issues ({result.errors.length})
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {result.errors.slice(0, 100).map((err, idx) => (
                <div key={idx} className="text-sm text-gray-300 bg-black/20 p-3 rounded-lg">
                  <span className="text-danger-400 font-bold">Question {err?.question || '?'}</span>
                  {err?.questionText && <span className="text-gray-400 mx-1">({err.questionText})</span>}
                  <span className="text-danger-400 font-bold">:</span> {err?.message || 'Unknown error'}
                </div>
              ))}
              {result.errors.length > 100 && (
                <div className="text-center text-gray-500 text-xs py-2">
                  ...and {result.errors.length - 100} more errors
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setResult(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Upload Another
          </button>
          <button
            onClick={() => navigate('/admin/quizzes')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Quizzes
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-8">
        Upload New Quiz
      </h1>

      <Card className="border-white/10">
        <form onSubmit={handleUpload} className="space-y-6">
          <Input
            label="Quiz Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Advanced React Patterns"
            required
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the quiz..."
          />

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Category <span className="text-danger-400">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="input bg-white/5 border-white/10 text-white focus:border-primary-500/50 focus:ring-primary-500/50"
              required
            >
              <option value="" className="bg-slate-800 text-gray-400">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-slate-800 text-white">{cat.name}</option>
              ))}
            </select>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 group cursor-pointer
              ${isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-white/20 hover:border-primary-500/50 hover:bg-white/5'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors
                ${isDragging ? 'bg-primary-500/20' : 'bg-white/5 group-hover:bg-primary-500/20'}`}>
                <DocumentTextIcon className={`w-8 h-8 transition-colors
                  ${isDragging ? 'text-primary-400' : 'text-gray-400 group-hover:text-primary-400'}`} />
              </div>
              <span className={`font-medium text-lg block mb-2 transition-colors
                ${isDragging ? 'text-primary-300' : 'text-primary-400 group-hover:text-primary-300'}`}>
                {isDragging ? 'Drop file here' : 'Upload Word Document'}
              </span>
              <p className="text-sm text-gray-400 mb-2">
                {file ? <span className="text-white font-medium">{file.name}</span> : 'Drag and drop or click to upload'}
              </p>
              <p className="text-xs text-gray-500">
                Supported format: .docx (Max 10MB)
              </p>
            </label>
          </div>

          {error && <div className="text-danger-400 text-sm bg-danger-500/10 p-3 rounded-lg border border-danger-500/20">{error}</div>}

          {uploading && (
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary-500 h-2.5 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading} className="min-w-[140px]">
              {uploading ? 'Processing...' : 'Upload & Parse'}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-8 bg-blue-500/10 p-6 rounded-xl border border-blue-500/20 text-sm text-blue-200">
        <h4 className="font-bold mb-3 text-blue-100 flex items-center gap-2">
          <span>ℹ️</span> Format Requirements:
        </h4>
        <ul className="list-disc pl-5 space-y-2 text-blue-200/80">
          <li>Use <strong className="text-white">.docx</strong> format only.</li>
          <li>Question format: <code className="bg-black/20 px-1.5 py-0.5 rounded text-blue-100">Câu 1. [Question Text]</code></li>
          <li>Options format: <code className="bg-black/20 px-1.5 py-0.5 rounded text-blue-100">A. [Option Text]</code></li>
          <li>Correct answer format: <code className="bg-black/20 px-1.5 py-0.5 rounded text-blue-100">Đáp án: A</code> (at the end of question or block)</li>
        </ul>
      </div>
    </div>
  );
}
