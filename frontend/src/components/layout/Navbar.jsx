import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { DarkModeToggle } from '../DarkModeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Quizzes', path: '/quizzes' },
    { name: 'History', path: '/history' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
                Q
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800 dark:from-white dark:to-white/80">
                QuizMaster
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700 shadow-sm backdrop-blur-sm dark:bg-white/10 dark:text-white'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-white/10">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-white/90 dark:hover:text-white group">
                  <div className="p-1 rounded-full bg-gray-100 group-hover:bg-gray-200 dark:bg-white/5 dark:group-hover:bg-white/10 transition-colors">
                    <UserCircleIcon className="h-6 w-6 text-primary-500 dark:text-primary-300" />
                  </div>
                  <span>{user.fullName || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-500 hover:text-danger-600 hover:bg-gray-100 dark:text-white/60 dark:hover:text-danger-300 dark:hover:bg-white/5 transition-all focus:outline-none"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 dark:text-white/70 dark:hover:text-white px-3 py-2 rounded-lg dark:hover:bg-white/5 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-sm py-1.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 absolute w-full left-0">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'block px-3 py-2 rounded-lg text-base font-medium transition-colors',
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/20 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200 dark:border-white/10 px-4">
            <div className="flex justify-end mb-4">
              <DarkModeToggle />
            </div>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-300">
                    <UserCircleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-base font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-white/50">{user.email}</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5"
                >
                  Your Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-danger-600 hover:bg-danger-50 dark:text-danger-300 dark:hover:bg-danger-500/10"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg text-base font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

