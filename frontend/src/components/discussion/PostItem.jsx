"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import CommentSection from "./CommentSection"
import "../../styles/discussion-forum.css"

const PostItem = ({ post, onInteraction }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [isDownvoted, setIsDownvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(post.upVotes?.length || 0)
  const [downvoteCount, setDownvoteCount] = useState(post.downVotes?.length || 0)
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpvote = async () => {
    try {
      const result = await onInteraction(post._id, "upvote")
      setIsUpvoted(result.data.upvoted)
      setIsDownvoted(false)
      setUpvoteCount(result.data.upvotes)
      setDownvoteCount(result.data.downvotes)
    } catch (err) {
      console.error("Error upvoting:", err)
    }
  }

  const handleDownvote = async () => {
    try {
      const result = await onInteraction(post._id, "downvote")
      setIsDownvoted(result.data.downvoted)
      setIsUpvoted(false)
      setUpvoteCount(result.data.upvotes)
      setDownvoteCount(result.data.downvotes)
    } catch (err) {
      console.error("Error downvoting:", err)
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/posts/${post._id}`

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.summary,
          url: url,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Error copying link:", err))
    }
  }

  const loadComments = async () => {
    if (!showComments) {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/posts/${post._id}/comments`)
        const data = await response.json()

        if (response.ok) {
          setComments(data.data)
        } else {
          throw new Error(data.message || "Failed to load comments")
        }
      } catch (err) {
        console.error("Error loading comments:", err)
      } finally {
        setIsLoading(false)
      }
    }

    setShowComments(!showComments)
  }

  const handleAddComment = async (content) => {
    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()

      if (response.ok) {
        setComments((prev) => [...prev, data.data])
        setCommentCount((prev) => prev + 1)
        return data.data
      } else {
        throw new Error(data.message || "Failed to add comment")
      }
    } catch (err) {
      console.error("Error adding comment:", err)
      throw err
    }
  }

  const incrementViewCount = async () => {
    if (!isExpanded) {
      try {
        await fetch(`/api/posts/${post._id}/views`, { method: "POST" })
      } catch (err) {
        console.error("Error incrementing view count:", err)
      }
    }
  }

  const handleExpand = () => {
    if (!isExpanded) {
      incrementViewCount()
    }
    setIsExpanded(!isExpanded)
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (err) {
      return "some time ago"
    }
  }

  const getPostTypeLabel = (type) => {
    switch (type) {
      case "interview-experience":
        return "Interview Experience"
      case "discussion":
        return "Discussion"
      case "doubt":
        return "Doubt"
      case "others":
        return "Others"
      default:
        return type
    }
  }

  return (
    <div className="post-item">
      <div className="post-votes">
        <button className={`vote-btn upvote ${isUpvoted ? "active" : ""}`} onClick={handleUpvote} aria-label="Upvote">
          ▲
        </button>
        <span className="vote-count">{upvoteCount - downvoteCount}</span>
        <button
          className={`vote-btn downvote ${isDownvoted ? "active" : ""}`}
          onClick={handleDownvote}
          aria-label="Downvote"
        >
          ▼
        </button>
      </div>

      <div className="post-content">
        <div className="post-header">
          <h3 className="post-title" onClick={handleExpand}>
            {post.title}
          </h3>
          <div className="post-meta">
            <span className="post-type">{getPostTypeLabel(post.postType)}</span>
            <span className="post-company">{post.company}</span>
            <span className="post-role">{post.role}</span>
          </div>
        </div>

        <div className="post-body">
          {isExpanded ? (
            <div className="post-full-content">{post.content}</div>
          ) : (
            <div className="post-summary" onClick={handleExpand}>
              {post.summary || post.content.substring(0, 150) + "..."}
            </div>
          )}

          {!isExpanded && post.content.length > 150 && (
            <button className="read-more-btn" onClick={handleExpand}>
              Read more
            </button>
          )}
        </div>

        {isExpanded && post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="post-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-footer">
          <div className="post-info">
            <span className="post-author">Posted by {post.username || "Anonymous"}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>

          <div className="post-actions">
            <button className="post-action-btn comment-btn" onClick={loadComments}>
              💬 {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
            </button>
            <button className="post-action-btn share-btn" onClick={handleShare}>
              🔗 Share
            </button>
          </div>
        </div>

        {showComments && (
          <div className="post-comments">
            {isLoading ? (
              <div className="loading-comments">Loading comments...</div>
            ) : (
              <CommentSection comments={comments} onAddComment={handleAddComment} postId={post._id} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostItem

