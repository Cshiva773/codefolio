import React, { useState } from 'react';

const CommentForm = ({ onSubmit, buttonText = 'Submit', placeholder = 'Write your comment...' }) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const success = await onSubmit(content);
      
      if (success) {
        setContent('');
      } else {
        setError('Failed to submit comment. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Comment submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {error && <div className="error-message">{error}</div>}
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="comment-textarea"
        disabled={submitting}
      />
      
      <button 
        type="submit" 
        className="submit-button"
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : buttonText}
      </button>
    </form>
  );
};

export default CommentForm;