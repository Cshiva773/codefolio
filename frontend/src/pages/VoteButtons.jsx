import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const VoteButtons = ({ postId, upVotes = [], downVotes = [] }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [upVoteCount, setUpVoteCount] = useState(upVotes.length);
  const [downVoteCount, setDownVoteCount] = useState(downVotes.length);
  const [upVoted, setUpVoted] = useState(user && upVotes.includes(user._id));
  const [downVoted, setDownVoted] = useState(user && downVotes.includes(user._id));

  const handleVote = async (voteType) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const endpoint = voteType === 'up' ? 'upvote' : 'downvote';
      const response = await fetch(`https://codefolio-4.onrender.com/api/posts/${postId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();
      
      // Update counts based on server response or local logic
      if (voteType === 'up') {
        if (upVoted) {
          // Removing upvote
          setUpVoteCount(upVoteCount - 1);
          setUpVoted(false);
        } else {
          // Adding upvote, potentially removing downvote
          setUpVoteCount(upVoteCount + 1);
          setUpVoted(true);
          
          if (downVoted) {
            setDownVoteCount(downVoteCount - 1);
            setDownVoted(false);
          }
        }
      } else {
        if (downVoted) {
          // Removing downvote
          setDownVoteCount(downVoteCount - 1);
          setDownVoted(false);
        } else {
          // Adding downvote, potentially removing upvote
          setDownVoteCount(downVoteCount + 1);
          setDownVoted(true);
          
          if (upVoted) {
            setUpVoteCount(upVoteCount - 1);
            setUpVoted(false);
          }
        }
      }
    } catch (error) {
      console.error('Error voting on post:', error);
    }
  };

  return (
    <div className="vote-buttons">
      <button 
        className={`vote-btn upvote-btn ${upVoted ? 'active' : ''}`}
        onClick={() => handleVote('up')}
        aria-label="Upvote"
      >
        <i className="fa fa-arrow-up"></i>
        <span className="vote-count">{upVoteCount}</span>
      </button>
      
      <button 
        className={`vote-btn downvote-btn ${downVoted ? 'active' : ''}`}
        onClick={() => handleVote('down')}
        aria-label="Downvote"
      >
        <i className="fa fa-arrow-down"></i>
        <span className="vote-count">{downVoteCount}</span>
      </button>
    </div>
  );
};

export default VoteButtons;