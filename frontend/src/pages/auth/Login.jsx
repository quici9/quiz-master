import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

export default function Login() {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email) return t('login.errors.emailRequired');
    if (!/\S+@\S+\.\S+/.test(email)) return t('login.errors.emailInvalid');
    if (!password) return t('login.errors.passwordRequired');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('login.success'));
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || t('login.errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t('login.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-white/70">
          {t('login.subtitle')}{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-white dark:hover:text-white/80 underline decoration-primary-300 dark:decoration-white/30 hover:decoration-primary-500 dark:hover:decoration-white">
            {t('login.trial')}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label={t('login.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              required
              error={error && error.includes(t('login.errors.emailRequired').split(' ')[0]) ? error : undefined}
            />

            <Input
              label={t('login.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
              required
              error={error && !error.includes(t('login.errors.emailRequired').split(' ')[0]) ? error : undefined}
            />

            {error && !error.includes(t('login.errors.emailRequired').split(' ')[0]) && (
              <div className="text-danger-300 bg-danger-500/10 border border-danger-500/20 p-2 rounded text-sm text-center">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
              >
                {t('login.button')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
