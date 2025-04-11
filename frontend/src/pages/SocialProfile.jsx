import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../AuthContext'
import sImage from "../assets/social-profile.jpg";
import TotalActiveDays from '../components/LeetCodeDashboard'
import logo from '../assets/logo.png'


const SocialProfile = () => {
  const navigate = useNavigate()
  const { user, token, logout } = useAuth() // Adding logout from context

  // State variables for form fields
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [batchYear, setBatchYear] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [location, setLocation] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [leetcode, setLeetcode] = useState('')
  const [github, setGithub] = useState('')
  const [codeforces, setCodeforces] = useState('')
  const [resume, setResume] = useState('')
  
  // State for error handling
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch previous data on component mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  
    const fetchProfile = async () => {
      // Get the token from localStorage if not in context
      const authToken = token || localStorage.getItem("authToken");
      
      console.log("Using token for profile fetch:", authToken); // Debugging
    
      if (!authToken) {
        console.error("User token is missing!");
        setError("Authentication token is missing");
        setIsLoading(false);
        return;
      }
    
      try {
        const response = await fetch("https://codefolio-4.onrender.com/api/user/profile", {
          method: 'GET',
          credentials: 'include', // Include cookies if available
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Profile fetch error response:", errorData);
          
          // If token is invalid, logout the user and redirect to login
          if (response.status === 401) {
            toast.error("Your session has expired. Please login again.");
            logout();
            navigate('/login');
            return;
          }
          
          throw new Error(errorData.message || "Failed to fetch profile");
        }
    
        const data = await response.json();
        console.log("Profile Data:", data);
        
        // Update state with profile data
        if (data) {
          setUsername(data.user.username || '');
          setFullName(data.user.fullName || '');
          setEmail(data.user.email || '');
          setBio(data.user.bio || '');
          setBatchYear(data.user.batchYear || '');
          setCollegeName(data.user.collegeName || '');
          setLocation(data.user.location || '');
          setPortfolio(data.user.portfolio || '');
          setLinkedin(data.user.linkedin || '');
          setLeetcode(data.user.leetcode || '');
          setGithub(data.user.github || '');
          setCodeforces(data.user.codeforces || '');
          setResume(data.user.resume || '');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  
  }, [user, navigate, token, logout]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }

    // Get the token from localStorage if not in context
    const authToken = token || localStorage.getItem("authToken");

    if (!authToken) {
      toast.error('Authentication token is missing');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://codefolio-4.onrender.com/api/user/update-profile', {
        method: 'PATCH',
        credentials: 'include', // Include cookies if available
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          username, 
          fullName, 
          email,
          bio, 
          batchYear, 
          collegeName, 
          location, 
          portfolio, 
          linkedin, 
          leetcode, 
          github, 
          codeforces, 
          resume
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // If token is invalid, logout the user and redirect to login
        if (response.status === 401) {
          toast.error("Your session has expired. Please login again.");
          logout();
          navigate('/login');
          return;
        }
        
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      toast.success('Profile updated successfully');
      
      // Optional: redirect or update local state
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  }

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={sImage} alt="Profile Illustration" />
      </div>
      
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={logo} alt="Logo" />
          </div>
          
          <div className="login-center">
            <h2>Complete Your Profile</h2>
            <p>Fill in your details to create a comprehensive profile</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            
            
            <input 
              type="text" 
              placeholder="College Name" 
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
            />
            
            
            <input 
              type="text" 
              placeholder="LeetCode" 
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="GitHub" 
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
           
            
            <div className="login-center-buttons">
              <button type="submit">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SocialProfile