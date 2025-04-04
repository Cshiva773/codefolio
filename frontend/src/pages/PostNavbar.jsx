import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PostNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>ForumHub</h1>
        </Link>
        
        <div className="navbar-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`navbar-menu ${showMobileMenu ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/create-post" className="nav-link">Create Post</Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">Profile</Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PostNavbar;