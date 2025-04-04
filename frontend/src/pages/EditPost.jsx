import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    company: '',
    role: '',
    postType: '',
    domain: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  
  useEffect(() => {
    // Load post data and reference lists
    fetchPost();
    fetchCompanies();
    fetchIndustries();
  }, [id]);
  
  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      
      const data = await response.json();
      const post = data.data;
      
      // Check if the user is the author
      if (user._id !== post.userId) {
        navigate(`/posts/${id}`);
        return;
      }
      
      setFormData({
        title: post.title,
        content: post.content,
        summary: post.summary,
        company: post.company,
        role: post.role,
        postType: post.postType,
        domain: post.domain,
        tags: post.tags || []
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post. It may have been removed or does not exist.');
      setLoading(false);
    }
  };
  
  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/companies');
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
      const response = await fetch('http://localhost:3000/api/industries');
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
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tag]
        });
        setTagInput('');
      }
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    
    if (!formData.company.trim()) {
      setError('Company is required');
      return;
    }
    
    if (!formData.role.trim()) {
      setError('Role is required');
      return;
    }
    
    if (!formData.domain.trim()) {
      setError('Domain/Industry is required');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Generate a summary if not provided
      if (!formData.summary.trim()) {
        formData.summary = formData.content.substring(0, 150) + (formData.content.length > 150 ? '...' : '');
      }
      
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post');
      }
      
      const data = await response.json();
      
      // Redirect to the post detail page
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error.message || 'An error occurred while updating your post. Please try again.');
      setSaving(false);
    }
  };
  
  if (loading) return <div className="loading">Loading post...</div>;
  
  return (
    <div className="edit-post-page">
      <div className="container">
        <h1>Edit Post</h1>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Add a descriptive title"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              >
                <option value="">Select a company</option>
                {companies.map(company => (
                  <option key={company._id} value={company.name}>
                    {company.name}
                  </option>
                ))}
                <option value="other">Other (Not Listed)</option>
              </select>
              
              {formData.company === 'other' && (
                <input
                  type="text"
                  name="companyOther"
                  placeholder="Enter company name"
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="other-input"
                  required
                />
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Software Engineer, Product Manager"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postType">Post Type *</label>
              <select
                id="postType"
                name="postType"
                value={formData.postType}
                onChange={handleChange}
                required
              >
                <option value="interview experience">Interview Experience</option>
                <option value="discussion">Discussion</option>
                <option value="doubt">Doubt/Question</option>
                <option value="others">Others</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="domain">Industry/Domain *</label>
              <select
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                required
              >
                <option value="">Select an industry</option>
                {industries.map((industry, index) => (
                  <option key={index} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your experience, thoughts, or questions..."
              rows="12"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Brief summary of your post (optional, will be auto-generated if left empty)"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <p className="form-help">Press Enter or comma after each tag</p>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags relevant to your post"
            />
            
            <div className="tags-container">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button 
                    type="button" 
                    className="tag-remove" 
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate(`/posts/${id}`)}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="btn-submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;