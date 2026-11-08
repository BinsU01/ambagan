// OWNER: Member 1
// API: GET /api/groups, POST /api/groups { name, memberEmails }
// Design: "Desktop · My Groups" + "Mobile · My Groups" artboards.
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function MyGroups() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="container">
        <p className="eyebrow">My Groups</p>
        <h1 className="display">Hi, {user?.name}.</h1>
        <p className="muted">TODO (Member 1): list groups as cards + Create Group form.</p>
      </main>
    </>
  );
}
