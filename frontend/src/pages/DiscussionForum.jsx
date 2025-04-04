import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import PostFilter from './PostFilter';

const DiscussionForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    postType: '',
    domain: '',
    sortBy: 'recent',
    searchTerm: ''
  });

  useEffect(() => {
    fetchPosts();
  }, [currentPage, filters]);

  const fetchPosts = async () => {
    setLoading(true);
    
    try {
      // Build query parameters from filters
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (filters.company) queryParams.append('company', filters.company);
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.postType) queryParams.append('postType', filters.postType);
      if (filters.domain) queryParams.append('domain', filters.domain);
      if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
      
      // Set sort parameter based on sortBy value
      if (filters.sortBy === 'recent') {
        queryParams.append('sort', '-createdAt');
      } else if (filters.sortBy === 'popular') {
        queryParams.append('sort', '-views');
      } else if (filters.sortBy === 'comments') {
        queryParams.append('sort', '-commentCount');
      } else if (filters.sortBy === 'votes') {
        queryParams.append('sort', '-voteCount');
      }
      
      const response = await fetch(`http://localhost:3000/api/posts/filter?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      
      setPosts(data.data || []);
      setTotalPages(data.pagination ? data.pagination.totalPages : 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="page-header">
          <h1>Discussion Forum</h1>
          <p>Share your experiences, ask questions, and connect with others</p>
        </div>
        
        <div className="content-grid">
          <aside className="sidebar">
            <PostFilter onFilter={handleFilterChange} />
          </aside>
          
          <div className="main-feed">
            {loading ? (
              <div className="loading">Loading posts...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : posts.length === 0 ? (
              <div className="no-posts">
                <h3>No posts found</h3>
                <p>Try adjusting your filters or create a new post</p>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
            
            {!loading && totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-btn prev"
                >
                  Previous
                </button>
                
                <div className="page-numbers">
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      onClick={() => handlePageChange(number + 1)}
                      className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                    >
                      {number + 1}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-btn next"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;