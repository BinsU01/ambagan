
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import api, { getErrorMessage } from '../api/client.js';
import { toCentavos } from '../utils/money.js';

export default function AddExpense() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitAmong, setSplitAmong] = useState([]);

  // Load group details and members
  useEffect(() => {
    let active = true;

    async function loadGroup() {
      setLoading(true);
      setError('');

      try {
        const res = await api.get(`/groups/${groupId}`);

        if (!active) return;

        const groupData = res.data.group;
        setGroup(groupData);

        const members = groupData.members || [];

        if (members.length > 0) {
          setPaidBy(String(members[0]._id));
          setSplitAmong(members.map((member) => String(member._id)));
        }
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadGroup();

    return () => {
      active = false;
    };
  }, [groupId]);

  function handleSplitChange(memberId) {
    setSplitAmong((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setSuccess('');

    const pesoAmount = toCentavos(amount);

    if (!description.trim()) {
      setError('Please enter an expense description.');
      return;
    }

    if (!Number.isSafeInteger(pesoAmount) || pesoAmount <= 0) {
      setError('Please enter a valid amount greater than ₱0.00.');
      return;
    }

    if (!paidBy) {
      setError('Please select who paid for this expense.');
      return;
    }

    if (splitAmong.length === 0) {
      setError('Please select at least one member to split the expense.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/groups/${groupId}/expenses`, {
        description: description.trim(),
        amount: pesoAmount,
        paidBy,
        splitAmong,
      });

      setSuccess('Expense added successfully!');

      setTimeout(() => {
        navigate(`/groups/${groupId}`);
      }, 700);
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Spinner fullPage label="Loading group members..." />
      </>
    );
  }

  if (error && !group) {
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

  const members = group?.members || [];

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="form" style={{ maxWidth: '620px', margin: '40px auto' }}>
          <Link
            to={`/groups/${groupId}`}
            className="eyebrow"
            style={{ textDecoration: 'none' }}
          >
            ← Back to {group?.name || 'Group'}
          </Link>

          <p className="eyebrow" style={{ marginTop: '20px' }}>
            GROUP EXPENSE
          </p>

          <h1 className="display">New Expense</h1>

          <p className="muted">
            Record a shared expense and choose who will split the cost.
          </p>

          {error && (
            <p className="alert alert-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="alert alert-success" role="status">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label className="field">
              <span className="label">Description</span>
              <input
                type="text"
                placeholder="e.g. Dinner, Groceries, Transportation"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={100}
                required
                disabled={submitting}
              />
            </label>

            <label className="field">
              <span className="label">Amount (₱)</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
                disabled={submitting}
              />
              <small className="muted">
                Enter the total expense in Philippine pesos.
              </small>
            </label>

            <label className="field">
              <span className="label">Who paid?</span>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                required
                disabled={submitting}
              >
                <option value="">Select a member</option>

                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </label>

            <div className="field">
              <span className="label">Split among</span>

              <p className="muted">
                Select the members who will share this expense.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: '12px',
                  marginTop: '12px',
                }}
              >
                {members.map((member) => {
                  const memberId = String(member._id);
                  const checked = splitAmong.includes(memberId);

                  return (
                    <label
                      key={memberId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        border: '1px solid var(--border, #ddd)',
                        borderRadius: '10px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleSplitChange(memberId)}
                        disabled={submitting}
                      />

                      <span>
                        <strong>{member.name}</strong>
                        <br />
                        <small className="muted">{member.email}</small>
                      </span>
                    </label>
                  );
                })}
              </div>

              <small className="muted">
                {splitAmong.length} member(s) selected
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                submitting ||
                !description.trim() ||
                !amount ||
                !paidBy ||
                splitAmong.length === 0
              }
              style={{ width: '100%', marginTop: '20px' }}
            >
              {submitting ? 'Saving Expense...' : 'Add Expense'}
            </button>

            <Link
              to={`/groups/${groupId}`}
              className="btn"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '12px',
                textDecoration: 'none',
              }}
            >
              Cancel
            </Link>
          </form>
        </div>
      </main>
    </>
  );
}
