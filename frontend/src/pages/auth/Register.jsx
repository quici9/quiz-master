import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

export default function Register() {
  const { t } = useTranslation('auth');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const { email, password, confirmPassword, fullName } = formData;

    if (!fullName) newErrors.fullName = t('register.errors.fullNameRequired');

    if (!email) newErrors.email = t('register.errors.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('register.errors.emailInvalid');

    if (!password) newErrors.password = t('register.errors.passwordRequired');
    else if (password.length < 6) newErrors.password = t('register.errors.passwordTooShort');

    if (!confirmPassword) newErrors.confirmPassword = t('register.errors.confirmPasswordRequired');
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordMismatch');
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.fullName);
      toast.success(t('register.success'));
      navigate('/');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error?.message;
      if (message?.toLowerCase().includes('email')) {
        setErrors({ email: message });
      } else {
        toast.error(message || t('register.errors.registrationFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t('register.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-white/70">
          {t('register.subtitle')}{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-white dark:hover:text-white/80 underline decoration-primary-300 dark:decoration-white/30 hover:decoration-primary-500 dark:hover:decoration-white">
            {t('register.signIn')}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label={t('register.fullName')}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t('register.fullNamePlaceholder')}
              required
              error={errors.fullName}
            />

            <Input
              label={t('register.email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('register.emailPlaceholder')}
              required
              error={errors.email}
            />

            <Input
              label={t('register.password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('register.passwordPlaceholder')}
              required
              error={errors.password}
            />


            <Input
              label={t('register.confirmPassword')}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('register.confirmPasswordPlaceholder')}
              required
              error={errors.confirmPassword}
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
              >
                {t('register.button')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
