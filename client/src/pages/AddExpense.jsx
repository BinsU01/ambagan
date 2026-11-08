// OWNER: Member 2
// API: POST /api/groups/:groupId/expenses
//      body: { description, amount: toCentavos(input), paidBy, splitAmong: [userIds] }
// Design: "Mobile · Add Expense" artboard.
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function AddExpense() {
  const { groupId } = useParams();

  return (
    <>
      <Navbar />
      <main className="container">
        <p className="eyebrow">Group {groupId}</p>
        <h1 className="display">New Expense</h1>
        <p className="muted">TODO (Member 2): description, amount (₱), who paid, split-among checkboxes.</p>
      </main>
    </>
  );
}
