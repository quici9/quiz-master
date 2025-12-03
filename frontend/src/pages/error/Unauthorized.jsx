import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <ShieldExclamationIcon className="w-16 h-16 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
      <p className="text-gray-500 mt-2 mb-8 max-w-md">
        You do not have permission to access this page. This area is restricted to administrators.
      </p>
      <div className="flex gap-4">
        <Link to="/">
            <Button variant="secondary">Go to Dashboard</Button>
        </Link>
        <Link to="/login" onClick={() => localStorage.clear()}>
            <Button variant="primary">Login as Admin</Button>
        </Link>
      </div>
    </div>
  );
}
