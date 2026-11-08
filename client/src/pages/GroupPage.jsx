// OWNERS: Member 2 (expense history) + Member 3 (balances panel)
// API: GET /api/groups/:id, GET /api/groups/:id/expenses, GET /api/groups/:id/balances
// Design: "Desktop · Group page" + "Mobile · Group page" artboards.
// Tip: split into components/ExpenseList.jsx and components/BalancesPanel.jsx
// so you two don't edit the same file (fewer merge conflicts).
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function GroupPage() {
  const { groupId } = useParams();

  return (
    <>
      <Navbar />
      <main className="container">
        <p className="eyebrow">Group</p>
        <h1 className="display">Group {groupId}</h1>
        <Link to={`/groups/${groupId}/expenses/new`} className="btn btn-primary">
          Add Expense
        </Link>
        <p className="muted">TODO: expense history (Member 2) + balances panel (Member 3).</p>
      </main>
    </>
  );
}
