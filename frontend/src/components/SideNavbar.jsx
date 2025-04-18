import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FaEnvelope, FaGlobe, FaLinkedin } from "react-icons/fa";
import Logo from '../assets/logo.png'; // Adjust the path as necessary
import './SideNavbar.css';

const SideNavbar = ({ user }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    // Navigate to login is handled by AuthContext
  };

  return (
    <div className="side-navbar">
      {/* Logo added at the top */}
      <Link to="/" className="nav-logo">
        <div className="flex items-center justify-center py-4">
          <img src={Logo} alt="Logo" className="w-10 h-12 mr-3" />
          <span className="text-2xl font-bold text-gray-800">CodeFolio</span>
        </div>
      </Link>

      <div className="nav-profile">
          {user?.profileInfo?.profilePicture ? (
        <div className="profile-wrapper">
            <img
              src={user.profileInfo.profilePicture}
              alt="Profile"
              className="profile-image"
            />
       </div>
          ) : (
            <div className="profile-avatar">
              {user?.fullName?.charAt(0).toUpperCase() ||
               user?.username?.charAt(0).toUpperCase() ||
               "👤"}
            </div>
          )}

        <div className="profile-info">
          <h3>{user?.fullName || user?.username || 'User'}</h3>
          <p className="stat-value">@{user?.username}</p>
          <p>{user?.profileInfo?.collegeName || 'No College'}</p>
        </div>
      </div>
      
      <div className="nav-stats flex gap-4">
        <div className="stat-item flex items-center gap-2">
          {user?.email ? (
            <a href={`mailto:${user.email}`} target="_blank" rel="noopener noreferrer">
              <FaEnvelope className="text-green-500 text-xl cursor-pointer" />
            </a>
          ) : (
            <FaEnvelope className="text-red-500 text-xl" />
          )}
          <span className="stat-label">Mail</span>
        </div>
        
        <div className="stat-item flex items-center gap-2">
          {user?.socialLinks?.portfolio ? (
            <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
              <FaGlobe className="text-green-500 text-xl cursor-pointer" />
            </a>
          ) : (
            <FaGlobe className="text-red-500 text-xl" />
          )}
          <span className="stat-label">Portfolio</span>
        </div>
        
        <div className="stat-item flex items-center gap-2">
          {user?.socialLinks?.linkedin ? (
            <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-green-500 text-xl cursor-pointer" />
            </a>
          ) : (
            <FaLinkedin className="text-red-500 text-xl" />
          )}
          <span className="stat-label">LinkedIn</span>
        </div>
      </div>
      
      <nav className="nav-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          <span className="nav-icon">📈</span>
          <span>LeetCode Stats</span>
        </Link>
        <Link to="/github" className={location.pathname === '/github' ? 'active' : ''}>
          <span className="nav-icon">📊</span>
          <span>Github Stats</span>
        </Link>
        <Link to="/ai" className={location.pathname === '/ai' ? 'active' : ''}>
          <span className="nav-icon">🤖</span>
          <span>AI-Interviewer</span>
        </Link>
        <Link to="/problems" className={location.pathname === '/problems' ? 'active' : ''}>
          <span className="nav-icon">🧩</span>
          <span>Problem Vault</span>
        </Link>
        <Link to="/community" className={location.pathname === '/community' ? 'active' : ''}>
          <span className="nav-icon">👥</span>
          <span>Community</span>
        </Link>
      </nav>
      
      <div className="nav-footer">
        <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </Link>
        <button className="logout-button" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;