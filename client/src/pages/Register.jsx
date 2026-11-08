import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/client.js';
import AuthLayout from './AuthLayout.jsx';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/groups" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Quick client-side checks; the server validates again.
    if (!form.name.trim()) return setError('Please enter your name');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');

    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate('/groups', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Join the ambagan." subtitle="Split the bill, keep the barkada.">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <h2 className="display form-title">Create account</h2>

        {error && <p className="alert alert-error" role="alert">{error}</p>}

        <label className="field">
          <span className="label">Name</span>
          <input name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} />
        </label>

        <label className="field">
          <span className="label">Email</span>
          <input name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} />
        </label>

        <label className="field">
          <span className="label">Password</span>
          <input name="password" type="password" autoComplete="new-password" required minLength={6} value={form.password} onChange={handleChange} />
          <span className="hint">At least 6 characters</span>
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="muted center">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
