// OWNER: Rodner (Balances)
// Props: groupId (string), group ({ name, members: [{ _id, name, email }] })
// API:   GET /api/groups/:groupId/balances
// Show:  each member's net (teal "gets back" if > 0, red "owes" if < 0)
//        + "Who pays whom" list from transfers
// Needs: loading spinner, error message
//
// import { useEffect, useState } from 'react';
// import api, { getErrorMessage } from '../api/client.js';
// import { formatPeso } from '../utils/money.js';
// import Spinner from './Spinner.jsx';

export default function BalancesPanel({ groupId }) {
  return (
    <div className="panel">
      <h2 className="display panel-title">Balances</h2>
      <p className="muted">TODO (Rodner): balances for group {groupId}.</p>
    </div>
  );
}
