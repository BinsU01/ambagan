
import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import { formatPeso } from '../utils/money.js';
import Spinner from './Spinner.jsx';

export default function ExpenseList({ groupId, group }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchExpenses() {
      setLoading(true);
      setError('');

      try {
        const res = await api.get(`/groups/${groupId}/expenses`);

        if (active) {
          setExpenses(res.data.expenses || []);
        }
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchExpenses();

    return () => {
      active = false;
    };
  }, [groupId]);

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

      {loading && (
        <Spinner label="Loading expenses..." />
      )}

      {!loading && error && (
        <div className="alert alert-error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setLoading(true);
              setError('');

              api.get(`/groups/${groupId}/expenses`)
                .then((res) => {
                  setExpenses(res.data.expenses || []);
                })
                .catch((err) => {
                  setError(getErrorMessage(err));
                })
                .finally(() => setLoading(false));
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && expenses.length === 0 && (
        <div className="empty-state">
          <h3>No expenses yet</h3>
          <p className="muted">
            No expenses have been recorded for this group.
            Add your first expense to get started!
          </p>
        </div>
      )}

      {!loading && !error && expenses.length > 0 && (
        <div className="expense-list">
          {expenses.map((expense) => {
            const payer =
              typeof expense.paidBy === 'object'
                ? expense.paidBy?.name
                : group?.members?.find(
                    (member) => member._id === expense.paidBy
                  )?.name;

            const splitMembers = (expense.splitAmong || [])
              .map((member) => {
                if (typeof member === 'object') {
                  return member.name;
                }

                return group?.members?.find(
                  (groupMember) => groupMember._id === member
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
                  <h3 style={{ margin: '0 0 6px' }}>
                    {expense.description}
                  </h3>

                  <p className="muted" style={{ margin: '0 0 5px' }}>
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

                <strong
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.1rem',
                  }}
                >
                  {formatPeso(expense.amount)}
                </strong>
              </article>
            );
          })}
        </div>
      )}

      {!loading && !error && expenses.length > 0 && (
        <p className="muted" style={{ marginTop: '16px' }}>
          {expenses.length} expense(s) recorded
        </p>
      )}
    </div>
  );
}
