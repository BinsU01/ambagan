import { useCallback, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import { formatPeso } from '../utils/money.js';
import Spinner from './Spinner.jsx';

// Cycle the icon tile colors like the mockup (orange / yellow / teal)
const TILE_COLORS = ['tile-orange', 'tile-yellow', 'tile-teal'];

function formatDate(date) {
  if (!date) return 'Date unavailable';
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// onChange: called after a delete so GroupPage can refresh the balances.
export default function ExpenseList({ groupId, group, onChange }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpenses = useCallback(async () => {
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
  }, [groupId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  async function handleDelete(expenseId) {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    setDeletingId(expenseId);
    setError('');

    try {
      await api.delete(`/groups/${groupId}/expenses/${expenseId}`);
      setExpenses((current) => current.filter((expense) => expense._id !== expenseId));
      if (onChange) onChange();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  const nameOf = (person) =>
    typeof person === 'object'
      ? person?.name
      : group?.members?.find((m) => m._id === person)?.name;

  return (
    <div className="panel">
      <h2 className="display panel-title">Expenses</h2>

      {loading && <Spinner label="Loading expenses…" />}

      {!loading && error && (
        <div className="error-message">
          <p className="alert alert-error" role="alert">{error}</p>
          <button type="button" className="btn btn-secondary" onClick={fetchExpenses}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && expenses.length === 0 && (
        <div className="empty-state">
          <h3>No expenses yet</h3>
          <p className="muted">Add your first expense to get started!</p>
        </div>
      )}

      {!loading && !error && expenses.length > 0 && (
        <div className="expense-list">
          {expenses.map((expense, index) => {
            const splitMembers = (expense.splitAmong || []).map(nameOf).filter(Boolean);

            return (
              <article key={expense._id} className="expense-item">
                <span className={`expense-tile ${TILE_COLORS[index % TILE_COLORS.length]}`} aria-hidden="true">
                  {(expense.description || '?').charAt(0).toUpperCase()}
                </span>

                <div className="expense-info">
                  <h3 className="expense-title">{expense.description}</h3>
                  <p className="muted small">
                    Paid by {nameOf(expense.paidBy) || 'Unknown member'} · {formatDate(expense.date || expense.createdAt)}
                  </p>
                  {splitMembers.length > 0 && (
                    <p className="muted small">Split among: {splitMembers.join(', ')}</p>
                  )}
                </div>

                <div className="expense-side">
                  <strong className="expense-amount">{formatPeso(expense.amount)}</strong>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleDelete(expense._id)}
                    disabled={deletingId === expense._id}
                  >
                    {deletingId === expense._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
