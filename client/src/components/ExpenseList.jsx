
import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import { formatPeso } from '../utils/money.js';
import Spinner from './Spinner.jsx';

export default function ExpenseList({ groupId, group }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function fetchExpenses() {
    setLoading(true);
    setError('');

    try {
      const res = await api.get(`/groups/${groupId}/expenses`);
      setExpenses(res.data.expenses || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  async function handleDelete(expenseId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this expense?'
    );

    if (!confirmed) return;

    setDeletingId(expenseId);
    setError('');

    try {
      await api.delete(`/groups/${groupId}/expenses/${expenseId}`);

      setExpenses((current) =>
        current.filter((expense) => expense._id !== expenseId)
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(date) {
    if (!date) return 'Date unavailable';

    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div className="panel">
      <h2 className="display panel-title">Expenses</h2>

      {loading && <Spinner label="Loading expenses..." />}

      {!loading && error && (
        <div className="alert alert-error" role="alert">
          {error}
          <button type="button" onClick={fetchExpenses}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && expenses.length === 0 && (
        <div className="empty-state">
          <h3>No expenses yet</h3>
          <p className="muted">
            Add your first expense to get started!
          </p>
        </div>
      )}

      {!loading && !error && expenses.map((expense) => {
        const payer =
          typeof expense.paidBy === 'object'
            ? expense.paidBy?.name
            : group?.members?.find(
                (member) => member._id === expense.paidBy
              )?.name;

        const splitMembers = (expense.splitAmong || [])
          .map((member) => {
            if (typeof member === 'object') return member.name;

            return group?.members?.find(
              (m) => m._id === member
            )?.name;
          })
          .filter(Boolean);

        return (
          <article
            key={expense._id}
            className="expense-item"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              padding: '18px 0',
              borderBottom: '1px solid var(--border, #eee)',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h3>{expense.description}</h3>

              <p className="muted">
                Paid by {payer || 'Unknown member'}
                {' · '}
                {formatDate(expense.date || expense.createdAt)}
              </p>

              {splitMembers.length > 0 && (
                <small className="muted">
                  Split among: {splitMembers.join(', ')}
                </small>
              )}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '10px',
            }}>
              <strong>{formatPeso(expense.amount)}</strong>

              <button
                type="button"
                className="btn"
                onClick={() => handleDelete(expense._id)}
                disabled={deletingId === expense._id}
                style={{
                  color: '#dc2626',
                  border: '1px solid #dc2626',
                }}
              >
                {deletingId === expense._id
                  ? 'Deleting...'
                  : 'Delete'}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
