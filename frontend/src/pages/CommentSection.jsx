import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../AuthContext';
import CommentForm from './CommentForm';

const CommentSection = ({ postId }) => {
  const { user, token } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://codefolio-4.onrender.com/api/posts/${postId}/comments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
      setLoading(false);
    }
  };

  const addComment = async (content) => {
    try {
      const response = await fetch(`https://codefolio-4.onrender.com/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      // Refresh comments after adding
      fetchComments();
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const addReply = async (commentId, content) => {
    // Based on your backend structure, you might need to implement a dedicated endpoint for replies
    // This is a simplified example
    try {
      const response = await fetch(`https://codefolio-4.onrender.com/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add reply');
      }
      
      // Refresh comments after adding reply
      fetchComments();
      setReplyingTo(null);
      return true;
    } catch (error) {
      console.error('Error adding reply:', error);
      return false;
    }
  };

  if (loading) return <div className="loading">Loading comments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="comment-section">
      <h3 className="comments-title">Comments ({comments.length})</h3>
      
      {user && (
        <CommentForm onSubmit={addComment} buttonText="Post Comment" />
      )}
      
      {comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.username || 'Anonymous'}</span>
                <span className="comment-time">
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </span>
              </div>
              <div className="comment-content">{comment.content}</div>
              
              {user && (
                <div className="comment-actions">
                  <button 
                    className="reply-button"
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  >
                    {replyingTo === comment._id ? 'Cancel' : 'Reply'}
                  </button>
                </div>
              )}
              
              {replyingTo === comment._id && (
                <div className="reply-form-container">
                  <CommentForm 
                    onSubmit={(content) => addReply(comment._id, content)} 
                    buttonText="Post Reply" 
                    placeholder="Write your reply..."
                  />
                </div>
              )}
              
              {comment.replies && comment.replies.length > 0 && (
                <div className="replies">
                  {comment.replies.map(reply => (
                    <div key={reply._id} className="reply">
                      <div className="reply-header">
                        <span className="reply-author">{reply.username || 'Anonymous'}</span>
                        <span className="reply-time">
                          {formatDistanceToNow(new Date(reply.createdAt))} ago
                        </span>
                      </div>
                      <div className="reply-content">{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;