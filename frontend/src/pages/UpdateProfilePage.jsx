import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import './ProfileUpdatePage.css'; // Make sure to create this CSS file
import logo from '../assets/logo.png'


const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null); // State to hold user data
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const { token, logout } = useAuth() // Adding logout from context



  // Password update form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    bio: '',
    batchYear: '',
    collegeName: '',
    location: '',
    portfolio: '',
    linkedin: '',
    leetcode: '',
    github: '',
    codeforces: '',
    resume: ''
  });

  // Fetch current user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = token || localStorage.getItem("authToken");

      if (!authToken) {
        setError("Authentication token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          method: 'GET',
          credentials: 'include',
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();

        // Check for user data
        if (data && data.user) {
          setUser(data.user);

          // Initialize form data AFTER user data is fetched
          setFormData({
            username: data.user.username || '',
            fullName: data.user.fullName || '',
            bio: data.user.profileInfo?.bio || '',
            batchYear: data.user.profileInfo?.batchYear || '',
            collegeName: data.user.profileInfo?.collegeName || '',
            location: data.user.profileInfo?.location || '',
            portfolio: data.user.socialLinks?.portfolio || '',
            linkedin: data.user.socialLinks?.linkedin || '',
            leetcode: data.user.socialLinks?.leetcode || '',
            github: data.user.socialLinks?.github || '',
            codeforces: data.user.socialLinks?.codeforces || '',
            resume: data.user.socialLinks?.resume || ''
          });

          console.log("User data:", data.user);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch user profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    const authToken = token || localStorage.getItem("authToken");
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/user/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Add the auth token here

        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setUser(data.user);
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const authToken = token || localStorage.getItem("authToken");

    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Add the auth token here
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage('Password updated successfully!');
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordMessage(data.message || 'Failed to update password');
      }
    } catch (error) {
      setPasswordMessage('Error updating password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    const authToken = token || localStorage.getItem("authToken");

    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/auth/update-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}` // Add the auth token here
        },
        credentials: 'include',
        body: formData,
      });

      // Check if response has content
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        setMessage('Profile picture updated successfully!');
        setUser(data.user);
      } else {
        setMessage(data.message || 'Failed to update profile picture');
      }
    } catch (error) {
      setMessage('Error updating profile picture');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  if (loading && !user) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="profile-update-page">
      <div className="container">
      <div className="profile-header">
      <div className="logo-brand">
        <Link to="/dashboard" className="logo-link">
          <img src={logo} alt="CodeFolio Logo" className="logo-image" />
        </Link>
          <span className="brand-name">CodeFolio</span>
</div>

  <div className="text-content">
    <h1 className="main-heading">Update Your Profile</h1>
    <p className="sub-heading">Customize your profile information and security settings</p>
  </div>
</div>




        <div className="profile-content">
          {/* Left Column - Profile Picture */}
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-image-container">
                <div className="profile-image-wrapper">
                  <img
                    src={user?.profileInfo?.profilePicture || user?.fullName?.charAt(0) || user?.username?.charAt(0) || '👤'}
                    alt="Profile"
                    className="profile-image"
                  />
                </div>
                <label
                  htmlFor="profile-picture"
                  className="image-upload-button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden-input"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <h2 className="profile-name">
                {user?.fullName || 'Your Name'}
              </h2>
              <p className="profile-username">
                @{user?.username || 'username'}
              </p>
            </div>

            {/* <div className="profile-card">
              <h3 className="card-title">Profile Completion</h3>
              <div className="completion-container">
                <div className="completion-bar">
                  <div className="completion-progress" style={{ width: '70%' }}></div>
                </div>
                <p className="completion-text">70% Complete</p>
              </div>
              <div className="completion-items">
                <div className="completion-item">
                  <svg className="completion-icon complete" width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Basic Information</span>
                </div>
                <div className="completion-item">
                  <svg className="completion-icon complete" width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Profile Picture</span>
                </div>
                <div className="completion-item">
                  <svg className="completion-icon incomplete" width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                  <span>Social Links</span>
                </div>
              </div>
            </div> */}

            {/* Navigation Tabs */}
            <div className="profile-card navigation-card">
              <h3 className="card-title">Settings</h3>
              <div className="settings-nav">
                <button
                  className={`nav-button flex items-center gap-2 p-2 rounded ${activeTab === 'profile' ? 'text-blue-500 bg-blue-100 font-semibold' : 'text-gray-700'
                    }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  Profile Information
                </button>

                <button
                  className={`nav-button flex items-center gap-2 p-2 rounded ${activeTab === 'password' ? 'text-blue-500 bg-blue-100 font-semibold' : 'text-gray-700'
                    }`}
                  onClick={() => setActiveTab('password')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M8 9V7a2 2 0 114 0v2m-4 0h4m-4 0H6m4 0h4m2 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m12 0H4" />
                  </svg>
                  Change Password
                </button>
              </div>
            </div>

          </div>

          {/* Right Column - Forms */}
          <div className="profile-form-container">
            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <>
                {message && (
                  <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-card">
                    <h3 className="card-title">Basic Information</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="fullName" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label htmlFor="bio" className="form-label">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows="4"
                          value={formData.bio}
                          onChange={handleChange}
                          className="form-textarea"
                          placeholder="Tell us about yourself..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="form-card">
                    <h3 className="card-title">Academic Information</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="batchYear" className="form-label">
                          Batch Year
                        </label>
                        <input
                          type="text"
                          id="batchYear"
                          name="batchYear"
                          value={formData.batchYear}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="collegeName" className="form-label">
                          College Name
                        </label>
                        <input
                          type="text"
                          id="collegeName"
                          name="collegeName"
                          value={formData.collegeName}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="location" className="form-label">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-card">
                    <h3 className="card-title">Social Links</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="portfolio" className="form-label">
                          Portfolio Website
                        </label>
                        <input
                          type="string"
                          id="portfolio"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="linkedin" className="form-label">
                          LinkedIn
                        </label>
                        <input
                          type="string"
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="github" className="form-label">
                          GitHub
                        </label>
                        <input
                          type="string"
                          id="github"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="leetcode" className="form-label">
                          LeetCode
                        </label>
                        <input
                          type="string"
                          id="leetcode"
                          name="leetcode"
                          value={formData.leetcode}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="codeforces" className="form-label">
                          CodeForces
                        </label>
                        <input
                          type="string"
                          id="codeforces"
                          name="codeforces"
                          value={formData.codeforces}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="resume" className="form-label">
                          Resume Link
                        </label>
                        <input
                          type="string"
                          id="resume"
                          name="resume"
                          value={formData.resume}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Password Update Tab */}
            {activeTab === 'password' && (
              <>
                {passwordMessage && (
                  <div className={`message ${passwordMessage.includes('success') ? 'success' : 'error'}`}>
                    {passwordMessage}
                  </div>
                )}
                <form onSubmit={handlePasswordSubmit} className="profile-form password-form">
                  <div className="form-card">
                    <h3 className="card-title">Update Password</h3>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label htmlFor="currentPassword" className="form-label">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="form-input"
                          minLength="8"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="form-input"
                          minLength="8"
                          required
                        />
                      </div>
                    </div>
                    <div className="password-requirements">
                      <h4 className="requirements-title">Password Requirements:</h4>
                      <ul className="requirements-list">
                        <li className={passwordData.newPassword.length >= 8 ? 'met' : ''}>
                          At least 8 characters long
                        </li>
                        <li className={/[A-Z]/.test(passwordData.newPassword) ? 'met' : ''}>
                          At least one uppercase letter
                        </li>
                        <li className={/[a-z]/.test(passwordData.newPassword) ? 'met' : ''}>
                          At least one lowercase letter
                        </li>
                        <li className={/[0-9]/.test(passwordData.newPassword) ? 'met' : ''}>
                          At least one number
                        </li>
                        <li className={/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'met' : ''}>
                          At least one special character
                        </li>
                      </ul>
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className="btn-secondary"
                      >
                        Back to Profile
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;