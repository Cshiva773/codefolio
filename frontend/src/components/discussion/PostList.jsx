"use client"
import PostItem from "./PostItem"
import "../../styles/discussion-forum.css"

const PostList = ({ posts, onInteraction, pagination, onPageChange }) => {
  const { currentPage, totalPages, totalPosts } = pagination

  const renderPagination = () => {
    const pages = []
    const maxPagesToShow = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    // Add first page
    if (startPage > 1) {
      pages.push(
        <button key="1" onClick={() => onPageChange(1)} className="pagination-btn">
          1
        </button>,
      )

      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>,
        )
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`pagination-btn ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>,
      )
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>,
        )
      }

      pages.push(
        <button key={totalPages} onClick={() => onPageChange(totalPages)} className="pagination-btn">
          {totalPages}
        </button>,
      )
    }

    return pages
  }

  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <h3>No posts found</h3>
        <p>Be the first to start a discussion!</p>
      </div>
    )
  }

  return (
    <div className="post-list-container">
      <div className="post-count">
        Showing {posts.length} of {totalPosts} posts
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <PostItem key={post._id} post={post} onInteraction={onInteraction} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn prev"
          >
            &laquo; Prev
          </button>

          {renderPagination()}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn next"
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  )
}

export default PostList

