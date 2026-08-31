import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div>
        <Link to="/">SlotLock</Link>
        {user && <Link to="/my-bookings">My Bookings</Link>}
        {user && (user.role === 'owner' || user.role === 'admin') && (
          <Link to="/manage">Manage Resources</Link>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>{user.name} ({user.role})</span>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
