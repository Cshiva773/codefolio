import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CodingProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    codingProfiles: {
      leetcode: '',
      codechef: '',
      gfg: '',
      codeforces: ''
    }
  });
  const API_BASE_URL = 'http://localhost:5000';
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.codingProfiles) {
      setFormData(prevState => ({
        ...prevState,
        codingProfiles: {
          ...prevState.codingProfiles,
          [name]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user-profile`, formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) return <div>Loading...</div>;
  console.log('Sending profile data:', formData);
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Profile</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <h3 style={styles.subHeader}>Coding Profiles</h3>
        <div style={styles.inputGroup}>
          <label htmlFor="leetcode">LeetCode:</label>
          <input
            type="text"
            id="leetcode"
            name="leetcode"
            value={formData.codingProfiles.leetcode}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="codechef">Codechef:</label>
          <input
            type="text"
            id="codechef"
            name="codechef"
            value={formData.codingProfiles.codechef}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="gfg">GeekForGeeks:</label>
          <input
            type="text"
            id="gfg"
            name="gfg"
            value={formData.codingProfiles.gfg}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="codeforces">Codeforces:</label>
          <input
            type="text"
            id="codeforces"
            name="codeforces"
            value={formData.codingProfiles.codeforces}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  subHeader: {
    color: '#666',
    marginTop: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    textAlign: 'center',
  },
};

export default CodingProfile;