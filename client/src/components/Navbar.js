import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/explore', label: 'Explore' },
  { path: '/feed', label: 'Feed' },
  { path: '/trips', label: 'Trips' },
  { path: '/connect', label: 'Connect' },
  { path: '/chat', label: 'Chat' },
  { path: '/wishlist', label: 'Wishlist' },
  { path: '/notifications', label: '🔔' },
  { path: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav>
      <Link to="/" className="nav-logo">
        <span>🌍 TourismConnect</span>
      </Link>

      <div className="nav-links">
        {navLinks.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-link ${pathname === path ? 'active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="nav-actions">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-btn btn-outline">
              Profile
            </Link>
            <button className="nav-btn btn-primary" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn btn-outline">Log In</Link>
            <Link to="/register" className="nav-btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
