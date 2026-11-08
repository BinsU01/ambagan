import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/client.js';
import AuthLayout from './AuthLayout.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/groups" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || '/groups', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welcome back." subtitle="Ambag lang, walang utang na limot.">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <h2 className="display form-title">Log in</h2>

        {error && <p className="alert alert-error" role="alert">{error}</p>}

        <label className="field">
          <span className="label">Email</span>
          <input name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} />
        </label>

        <label className="field">
          <span className="label">Password</span>
          <input name="password" type="password" autoComplete="current-password" required value={form.password} onChange={handleChange} />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="muted center">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
