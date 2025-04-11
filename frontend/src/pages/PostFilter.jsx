import React, { useState, useEffect } from 'react';

const PostFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    postType: '',
    domain: '',
    sortBy: 'recent',
    searchTerm: ''
  });
  
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  
  useEffect(() => {
    // Fetch companies and industries for filter dropdowns
    fetchCompanies();
    fetchIndustries();
  }, []);
  
  const fetchCompanies = async () => {
    try {
      const response = await fetch('https://codefolio-4.onrender.com/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };
  
  const fetchIndustries = async () => {
    try {
      const response = await fetch('https://codefolio-4.onrender.com/api/industries');
      if (response.ok) {
        const data = await response.json();
        setIndustries(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };
  
  const handleReset = () => {
    setFilters({
      company: '',
      role: '',
      postType: '',
      domain: '',
      sortBy: 'recent',
      searchTerm: ''
    });
    
    onFilter({
      company: '',
      role: '',
      postType: '',
      domain: '',
      sortBy: 'recent',
      searchTerm: ''
    });
  };
  
  return (
    <div className="post-filter">
      <h3>Filter Posts</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="search-bar">
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleChange}
            placeholder="Search posts..."
            className="search-input"
          />
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="company">Company</label>
            <select
              id="company"
              name="company"
              value={filters.company}
              onChange={handleChange}
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company._id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="domain">Industry</label>
            <select
              id="domain"
              name="domain"
              value={filters.domain}
              onChange={handleChange}
            >
              <option value="">All Industries</option>
              {industries.map((industry, index) => (
                <option key={index} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={filters.role}
              onChange={handleChange}
              placeholder="Any Role"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="postType">Post Type</label>
            <select
              id="postType"
              name="postType"
              value={filters.postType}
              onChange={handleChange}
            >
              <option value="">All Types</option>
              <option value="interview experience">Interview Experience</option>
              <option value="discussion">Discussion</option>
              <option value="doubt">Doubt</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="sortBy">Sort By</label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="comments">Most Comments</option>
              <option value="votes">Most Upvotes</option>
            </select>
          </div>
        </div>
        
        <div className="filter-actions">
          <button type="submit" className="filter-btn apply">Apply Filters</button>
          <button type="button" className="filter-btn reset" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default PostFilter;