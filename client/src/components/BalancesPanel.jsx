import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import { formatPeso } from '../utils/money.js';
import Spinner from './Spinner.jsx';

export default function BalancesPanel({ groupId }) {
  const [balances, setBalances] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchBalances() {
      setLoading(true);
      setError('');

      try {
        const res = await api.get(`/groups/${groupId}/balances`);

        if (isMounted) {
          setBalances(res.data.balances || []);
          setTransfers(res.data.transfers || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (groupId) {
      fetchBalances();
    }

    return () => {
      isMounted = false;
    };
  }, [groupId]);

  return (
    <div className="panel">
      <h2 className="display panel-title">Balances</h2>

      {loading ? (
        <div className="loading-state">
          <Spinner />
          <p className="muted">Loading balances...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <section className="balance-section">
            <h3>Member Balances</h3>

            {balances.length === 0 ? (
              <p className="muted">No members found.</p>
            ) : (
              <div className="balance-list">
                {balances.map((item) => (
                  <div
                    className="balance-item"
                    key={item.user._id}
                  >
                    <div>
                      <strong>{item.user.name}</strong>
                      <p className="muted">
                        {item.net > 0
                          ? 'Gets back'
                          : item.net < 0
                            ? 'Owes'
                            : 'Settled'}
                      </p>
                    </div>

                    <strong
                      className={
                        item.net > 0
                          ? 'balance-positive'
                          : item.net < 0
                            ? 'balance-negative'
                            : 'balance-neutral'
                      }
                    >
                      {item.net > 0 ? '+' : item.net < 0 ? '-' : ''}
                      {formatPeso(Math.abs(item.net))}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="balance-section">
            <h3>Who Pays Whom</h3>

            {transfers.length === 0 ? (
              <p className="muted">
                Everyone is settled up!
              </p>
            ) : (
              <div className="transfer-list">
                {transfers.map((transfer, index) => (
                  <div
                    className="transfer-item"
                    key={`${transfer.from._id}-${transfer.to._id}-${index}`}
                  >
                    <div className="transfer-details">
                      <strong>{transfer.from.name}</strong>
                      <span className="muted"> pays </span>
                      <strong>{transfer.to.name}</strong>
                    </div>

                    <strong className="balance-negative">
                      {formatPeso(transfer.amount)}
                    </strong>
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