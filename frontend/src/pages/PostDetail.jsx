import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../AuthContext';
import VoteButtons from './VoteButtons';
import BookmarkButton from './BookmarkButton';
import CommentSection from './CommentSection';

const PostDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchPost();
    
    // Increment view count
    if (id) {
      incrementViews();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      
      const data = await response.json();
      setPost(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post. It may have been removed or does not exist.');
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await fetch(`http://localhost:3000/api/posts/${id}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // Just log the error but don't affect user experience
      console.error('Error incrementing views:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again later.');
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="not-found">Post not found</div>;

  const isAuthor = user && user._id === post.userId;

  return (
    <div className="post-detail-page">
      <div className="container">
        <div className="post-navigation">
          <Link to="/" className="back-link">
            ← Back to Posts
          </Link>
        </div>
        
        <article className="post-detail">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-meta">
              <div className="post-info">
                <span className="post-author">Posted by {post.username}</span>
                <span className="post-time">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                  {post.isEdited && <span className="edited-label">(edited)</span>}
                </span>
              </div>
              
              <div className="post-categories">
                <span className="post-company">{post.company}</span>
                <span className="post-role">{post.role}</span>
                <span className="post-type">{post.postType}</span>
                <span className="post-domain">{post.domain}</span>
              </div>
            </div>
            
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </header>
          
          <div className="post-content">
            {post.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          
          <footer className="post-footer">
            <div className="post-stats">
              <div className="post-metrics">
                <span className="views"><i className="fa fa-eye"></i> {post.views} views</span>
                <span className="comments"><i className="fa fa-comment"></i> {post.comments.length} comments</span>
              </div>
              
              <div className="post-actions">
                <VoteButtons 
                  postId={post._id} 
                  upVotes={post.upVotes} 
                  downVotes={post.downVotes} 
                />
                
                {user && <BookmarkButton 
                  postId={post._id} 
                  isBookmarked={user && post.bookmarks && post.bookmarks.includes(user._id)}
                />}
                
                {isAuthor && (
                  <div className="author-actions">
                    <Link to={`/edit-post/${post._id}`} className="edit-button">
                      Edit
                    </Link>
                    
                    {!confirmDelete ? (
                      <button 
                        className="delete-button"
                        onClick={() => setConfirmDelete(true)}
                      >
                        Delete
                      </button>
                    ) : (
                      <div className="confirm-delete">
                        <p>Are you sure?</p>
                        <button 
                          className="confirm-yes"
                          onClick={handleDelete}
                        >
                          Yes
                        </button>
                        <button 
                          className="confirm-no"
                          onClick={() => setConfirmDelete(false)}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </footer>
        </article>
        
        <section className="comments-container">
          <CommentSection postId={post._id} />
        </section>
      </div>
    </div>
  );
};

export default PostDetail;
