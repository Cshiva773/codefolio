import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../AuthContext';
import VoteButtons from './VoteButtons';
import BookmarkButton from './BookmarkButton';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const isAuthor = user && user._id === post.userId;
  
  // Truncate content for card view
  const truncatedContent = post.summary || 
    (post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content);

  return (
    <div className="post-card">
      <div className="post-card-header">
        <h3 className="post-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h3>
        <div className="post-meta">
          <span className="post-company">{post.company}</span>
          <span className="post-role">{post.role}</span>
          <span className="post-type">{post.postType}</span>
        </div>
      </div>
      
      <div className="post-content-preview">
        <p>{truncatedContent}</p>
      </div>
      
      <div className="post-tags">
        {post.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
      
      <div className="post-footer">
        <div className="post-stats">
          <div className="post-author">
            <span>By {post.username}</span>
          </div>
          <div className="post-time">
            {post.createdAt && (
              <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
            )}
          </div>
          <div className="post-metrics">
            <span className="views"><i className="fa fa-eye"></i> {post.views}</span>
            <span className="comments"><i className="fa fa-comment"></i> {post.comments.length}</span>
          </div>
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
            <Link to={`/edit-post/${post._id}`} className="edit-button">
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;