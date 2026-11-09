// OWNERS: Vince (header + members), Michael (ExpenseList), Rodner (BalancesPanel)
// Michael and Rodner: edit your own component file, not this one, to avoid merge conflicts.
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import { AvatarStack } from '../components/Avatar.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import BalancesPanel from '../components/BalancesPanel.jsx';
import api, { getErrorMessage } from '../api/client.js';

export default function GroupPage() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [memberMsg, setMemberMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    setLoading(true);
    api
      .get(`/groups/${groupId}`)
      .then((res) => setGroup(res.data.group))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [groupId]);

  async function handleAddMember(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    setMemberMsg({ type: '', text: '' });
    try {
      const res = await api.post(`/groups/${groupId}/members`, { email });
      setGroup(res.data.group);
      setEmail('');
      setMemberMsg({ type: 'success', text: 'Member added!' });
    } catch (err) {
      setMemberMsg({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Spinner fullPage label="Loading group…" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="container">
          <p className="alert alert-error" role="alert">{error}</p>
          <Link to="/groups">← Back to My Groups</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <header className="hero">
        <div className="hero-circle" aria-hidden="true" />
        <div className="hero-inner hero-row">
          <div className="hero-text">
            <Link to="/groups" className="eyebrow eyebrow-light back-link">← All groups</Link>
            <h1 className="display hero-title">{group.name}</h1>
            <div className="hero-members">
              <AvatarStack people={group.members} max={6} />
              <span>{group.members.map((m) => m.name.split(' ')[0]).join(', ')}</span>
            </div>
          </div>
          <Link to={`/groups/${groupId}/expenses/new`} className="btn btn-primary">
            + Add Expense
          </Link>
        </div>
      </header>

      <main className="container container-overlap group-layout">
        <section className="group-main">
          <ExpenseList groupId={groupId} group={group} />
        </section>

        <aside className="group-side">
          <BalancesPanel groupId={groupId} group={group} />

          <form onSubmit={handleAddMember} className="panel form">
            <h2 className="display panel-title">Add member</h2>
            {memberMsg.text && (
              <p className={`alert alert-${memberMsg.type}`} role="status">{memberMsg.text}</p>
            )}
            <label className="field">
              <span className="label">Email</span>
              <input
                type="email"
                placeholder="barkada@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={adding || !email.trim()}>
              {adding ? 'Adding…' : 'Add member'}
            </button>
          </form>
        </aside>
      </main>
    </>
  );
}
