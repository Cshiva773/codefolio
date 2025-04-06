"use client"

import { useState } from "react"
import "../../styles/discussion-forum.css"

const POST_TYPES = [
  { value: "interview-experience", label: "Interview Experience" },
  { value: "discussion", label: "Discussion" },
  { value: "doubt", label: "Doubt" },
  { value: "others", label: "Others" },
]

const CreatePost = ({ onClose, onPostCreated, companies, industries, apiRequest }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    company: "",
    role: "",
    postType: "discussion",
    domain: "",
    tags: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCompany, setNewCompany] = useState("")
  const [showNewCompanyInput, setShowNewCompanyInput] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }

    if (!formData.company && !newCompany) {
      newErrors.company = "Company is required"
    }

    if (!formData.role.trim()) {
      newErrors.role = "Position/Role is required"
    }

    if (!formData.domain.trim()) {
      newErrors.domain = "Industry/Domain is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleCompanyChange = (e) => {
    const value = e.target.value
    if (value === "add-new") {
      setShowNewCompanyInput(true)
      setFormData((prev) => ({ ...prev, company: "" }))
    } else {
      setShowNewCompanyInput(false)
      setFormData((prev) => ({ ...prev, company: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      // If user is adding a new company, submit it first
      let companyName = formData.company

      if (showNewCompanyInput && newCompany.trim()) {
        const companyResult = await apiRequest("/companies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newCompany.trim() }),
        })

        if (!companyResult.success) {
          throw new Error(companyResult.error || "Failed to add new company")
        }

        companyName = companyResult.data.data.name
      }

      // Process tags
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      // Submit the post
      const result = await apiRequest("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          company: companyName,
          tags: tagsArray,
        }),
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to create post")
      }

      onPostCreated(result.data.data)
    } catch (err) {
      console.error("Error creating post:", err)
      setErrors((prev) => ({ ...prev, submit: err.message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-post-modal">
      <div className="create-post-header">
        <h2>Create New Post</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a descriptive title"
            className={errors.title ? "error" : ""}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company">Company *</label>
            <select
              id="company"
              name="company"
              value={formData.company}
              onChange={handleCompanyChange}
              className={errors.company ? "error" : ""}
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company._id} value={company.name}>
                  {company.name}
                </option>
              ))}
              <option value="add-new">+ Add new company</option>
            </select>
            {showNewCompanyInput && (
              <input
                type="text"
                placeholder="Enter new company name"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="new-company-input"
              />
            )}
            {errors.company && <span className="error-message">{errors.company}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Position Applied For *</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer, Product Manager"
              className={errors.role ? "error" : ""}
            />
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="domain">Industry/Domain *</label>
            <select
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className={errors.domain ? "error" : ""}
            >
              <option value="">Select an industry</option>
              {industries.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
            {errors.domain && <span className="error-message">{errors.domain}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="postType">Post Type *</label>
            <select id="postType" name="postType" value={formData.postType} onChange={handleChange}>
              {POST_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
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
            placeholder="Share your experience, question, or thoughts..."
            rows="10"
            className={errors.content ? "error" : ""}
          ></textarea>
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. interview, coding, system-design"
          />
          <small>Add relevant tags to help others find your post</small>
        </div>

        {errors.submit && <div className="error-banner">{errors.submit}</div>}

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Post"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost

