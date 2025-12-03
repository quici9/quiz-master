import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CloudArrowUpIcon, DocumentDuplicateIcon, ChartPieIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const adminLinks = [
    {
      title: 'Upload Quiz',
      description: 'Import new quizzes from Word documents (.docx)',
      icon: CloudArrowUpIcon,
      to: '/admin/upload',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      title: 'Manage Quizzes',
      description: 'View, edit, or delete existing quizzes',
      icon: DocumentDuplicateIcon,
      to: '/admin/quizzes',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Analytics',
      description: 'View system-wide usage statistics (Coming Soon)',
      icon: ChartPieIcon,
      to: '/admin/quizzes', // Redirect to manage for now
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Manage your quiz system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminLinks.map((link) => (
          <Link key={link.title} to={link.to} className="block group">
            <Card className="h-full hover:bg-white/10 transition-all duration-300 border-white/10 group-hover:scale-[1.02] group-hover:shadow-xl">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border backdrop-blur-sm transition-transform group-hover:scale-110 duration-300 ${link.color}`}>
                <link.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                {link.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {link.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
