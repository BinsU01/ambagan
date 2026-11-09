// OWNER: Michael (Expenses)
// Props: groupId (string), group ({ name, members: [{ _id, name, email }] })
// API:   GET /api/groups/:groupId/expenses  -> newest first
// Show:  description, "Paid by X · date", amount with formatPeso(expense.amount)
// Needs: loading spinner, error message, empty state ("No expenses yet")
//
// import { useEffect, useState } from 'react';
// import api, { getErrorMessage } from '../api/client.js';
// import { formatPeso } from '../utils/money.js';
// import Spinner from './Spinner.jsx';

export default function ExpenseList({ groupId }) {
  return (
    <div className="panel">
      <h2 className="display panel-title">Expenses</h2>
      <p className="muted">TODO (Michael): expense history for group {groupId}, newest first.</p>
    </div>
  );
}
