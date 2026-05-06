import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthUser, isAdmin, logout } from '../utils/auth';

const Navbar = () => {
  const user = getAuthUser();
  const admin = isAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        EventHub
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/events">Events</Link>
            {!admin && <Link to="/my-bookings">My Bookings</Link>}
            {admin && <Link to="/admin">Admin Dashboard</Link>}
            <button className="btn-secondary" onClick={handleLogout}>
              Logout ({user.sub || 'User'})
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
