// OWNER: Vince (Groups)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import { AvatarStack } from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api, { getErrorMessage } from '../api/client.js';
import { formatPeso } from '../utils/money.js';

const CARD_COLORS = ['card-orange', 'card-teal', 'card-yellow'];

export default function MyGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', emails: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api
      .get('/groups')
      .then((res) => setGroups(res.data.groups))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!form.name.trim()) return setFormError('Please give your group a name');

    setSaving(true);
    try {
      const res = await api.post('/groups', { name: form.name, memberEmails: form.emails });
      setGroups([res.data.group, ...groups]);
      setForm({ name: '', emails: '' });
      setShowForm(false);
      setSuccess(`"${res.data.group.name}" created!`);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />

      <header className="hero">
        <div className="hero-circle" aria-hidden="true" />
        <div className="hero-inner">
          <p className="eyebrow eyebrow-light">
            {groups.length} {groups.length === 1 ? 'group' : 'groups'}
          </p>
          <h1 className="display hero-title">Hi, {user?.name?.split(' ')[0]}.</h1>
          <p className="hero-tagline">Ambag lang, walang utang na limot.</p>
        </div>
      </header>

      <main className="container container-overlap">
        <div className="toolbar">
          {success && <p className="alert alert-success" role="status">{success}</p>}
          <button type="button" className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancel' : '+ Create Group'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="panel form" noValidate>
            <h2 className="display panel-title">New group</h2>
            {formError && <p className="alert alert-error" role="alert">{formError}</p>}

            <label className="field">
              <span className="label">Group name</span>
              <input
                type="text"
                placeholder="e.g. Boracay Trip 2026"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={60}
                required
              />
            </label>

            <label className="field">
              <span className="label">Members' emails</span>
              <textarea
                rows={3}
                placeholder="michael@email.com, rodner@email.com"
                value={form.emails}
                onChange={(e) => setForm({ ...form, emails: e.target.value })}
              />
              <span className="hint">Separate with commas. They need an Ambagan account first. You're added automatically.</span>
            </label>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create group'}
            </button>
          </form>
        )}

        {loading && <Spinner label="Loading your groups…" />}
        {error && <p className="alert alert-error" role="alert">{error}</p>}

        {!loading && !error && groups.length === 0 && (
          <div className="empty">
            <h2 className="display">No groups yet</h2>
            <p className="muted">Create one for your next lakad, dorm bills, or thesis snacks.</p>
          </div>
        )}

        <div className="group-grid">
          {groups.map((group, i) => (
            <Link key={group._id} to={`/groups/${group._id}`} className="group-card">
              <div className={`group-card-top ${CARD_COLORS[i % CARD_COLORS.length]}`}>
                <span className="group-card-meta">
                  {group.expenseCount} {group.expenseCount === 1 ? 'expense' : 'expenses'} · {formatPeso(group.totalSpent)}
                </span>
                <span className="display group-card-name">{group.name}</span>
              </div>
              <div className="group-card-bottom">
                <AvatarStack people={group.members} />
                <span className="muted small">{group.members.length} members</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
