// components/BookmarkButton.jsx
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const BookmarkButton = ({ postId, isBookmarked }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to bookmark');
      }

      // Toggle bookmark state
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  return (
    <button 
      className={`bookmark-btn ${bookmarked ? 'active' : ''}`}
      onClick={handleBookmark}
      aria-label={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
    >
      <i className={`fa ${bookmarked ? 'fa-bookmark' : 'fa-bookmark-o'}`}></i>
    </button>
  );
};

export default BookmarkButton;