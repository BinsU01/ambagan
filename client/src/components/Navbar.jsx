import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/groups" className="logo">
        <span className="logo-a">a</span>mbagan
      </Link>
      <div className="navbar-right">
        <Link to="/groups" className="nav-link">My Groups</Link>
        {user && <span className="nav-user">{user.name}</span>}
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
