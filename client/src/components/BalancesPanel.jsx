import { useCallback, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import { formatPeso } from '../utils/money.js';
import Spinner from './Spinner.jsx';

// refreshKey: GroupPage bumps it whenever an expense is deleted or a member is
// added, so the balances always match the expense list.
export default function BalancesPanel({ groupId, refreshKey = 0 }) {
  const [balances, setBalances] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBalances = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get(`/groups/${groupId}/balances`);
      setBalances(res.data.balances || []);
      setTransfers(res.data.transfers || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) fetchBalances();
  }, [groupId, refreshKey, fetchBalances]);

  return (
    <div className="panel">
      <h2 className="display panel-title">Balances</h2>

      {loading ? (
        <div className="loading-state">
          <Spinner label="Loading balances…" />
          <p className="muted">Loading balances…</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p className="alert alert-error" role="alert">{error}</p>
          <button type="button" className="btn btn-secondary" onClick={fetchBalances}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <section className="balance-section">
            <h3 className="section-title">Member balances</h3>

            {balances.length === 0 ? (
              <p className="muted">No members found.</p>
            ) : (
              <div className="balance-list">
                {balances.map((item) => {
                  const kind = item.net > 0 ? 'positive' : item.net < 0 ? 'negative' : 'neutral';
                  const label = item.net > 0 ? 'Gets back' : item.net < 0 ? 'Owes' : 'Settled';
                  const sign = item.net > 0 ? '+' : item.net < 0 ? '−' : '';

                  return (
                    <div className="balance-item" key={item.user._id}>
                      <div className="balance-who">
                        <strong>{item.user.name}</strong>
                        <span className="muted small">{label}</span>
                      </div>
                      <strong className={`balance-chip balance-${kind}`}>
                        {sign}
                        {formatPeso(Math.abs(item.net))}
                      </strong>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="balance-section transfer-section">
            <h3 className="section-title">Who pays whom</h3>

            {transfers.length === 0 ? (
              <p className="transfer-empty">Everyone is settled up! 🎉</p>
            ) : (
              <div className="transfer-list">
                {transfers.map((transfer, index) => (
                  <div
                    className="transfer-item"
                    key={`${transfer.from._id}-${transfer.to._id}-${index}`}
                  >
                    <span className="transfer-details">
                      <strong>{transfer.from.name}</strong>
                      <span className="transfer-arrow"> pays </span>
                      <strong>{transfer.to.name}</strong>
                    </span>
                    <strong className="transfer-amount">{formatPeso(transfer.amount)}</strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
