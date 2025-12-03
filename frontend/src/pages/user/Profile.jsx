import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData); // This is a stub in AuthContext for now
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        My Profile
      </h1>

      <Card className="border-white/10">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-3xl font-bold border border-primary-500/30 shadow-lg shadow-primary-500/10">
            {user?.fullName?.charAt(0) || user?.email?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.fullName}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full uppercase font-medium border border-white/10">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="text-white"
          />
          <Input
            label="Email"
            name="email"
            value={formData.email}
            disabled
            className="opacity-75"
          />

          <Button type="submit" loading={loading} disabled className="w-full sm:w-auto">
            Save Changes (Coming Soon)
          </Button>
        </form>
      </Card>
    </div>
  );
}
