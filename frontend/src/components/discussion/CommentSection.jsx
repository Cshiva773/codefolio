"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import "../../styles/discussion-forum.css"

const CommentSection = ({ comments, onAddComment, postId }) => {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!newComment.trim()) {
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await onAddComment(newComment.trim())
      setNewComment("")
    } catch (err) {
      setError(err.message || "Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (err) {
      return "some time ago"
    }
  }

  return (
    <div className="comment-section">
      <h4 className="comment-section-title">Comments</h4>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="comment-input"
          rows="3"
        ></textarea>

        {error && <div className="comment-error">{error}</div>}

        <button type="submit" className="comment-submit-btn" disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">{comment.userId?.username || "Anonymous"}</div>
                <div className="comment-date">{formatDate(comment.createdAt)}</div>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection

