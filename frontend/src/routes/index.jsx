import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// User pages
import Dashboard from '../pages/user/Dashboard';
import QuizList from '../pages/user/QuizList';
import QuizDetail from '../pages/user/QuizDetail';
import QuizRunner from '../pages/user/QuizRunner';
import QuizResult from '../pages/user/QuizResult';
import History from '../pages/user/History';
import HistoryDetail from '../pages/user/HistoryDetail';
import Profile from '../pages/user/Profile';
import Bookmarks from '../pages/user/Bookmarks';
import Statistics from '../pages/user/Statistics';
import Leaderboard from '../pages/user/Leaderboard';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UploadQuiz from '../pages/admin/UploadQuiz';
import ManageQuizzes from '../pages/admin/ManageQuizzes';
import EditQuiz from '../pages/admin/EditQuiz';
import QuizAnalytics from '../pages/admin/QuizAnalytics';

// Error pages
import NotFound from '../pages/error/NotFound';
import Unauthorized from '../pages/error/Unauthorized';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected user routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
          {/* Quiz Runner might need a different layout or full screen */}
          <Route path="/quiz/:id/take" element={<QuizRunner />} />
          <Route path="/quiz/result/:attemptId" element={<QuizResult />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:attemptId" element={<HistoryDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Route>

      {/* Protected admin routes */}
      <Route element={<AdminRoute />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<UploadQuiz />} />
          <Route path="/admin/quizzes" element={<ManageQuizzes />} />
          <Route path="/admin/quizzes/:id/edit" element={<EditQuiz />} />
          <Route path="/admin/quizzes/:id/analytics" element={<QuizAnalytics />} />
        </Route>
      </Route>

      {/* Error routes */}
      <Route path="/401" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default AppRoutes;
