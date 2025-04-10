"use client"

import { useState } from "react"
import "../../styles/discussion-forum.css"

const POST_TYPES = [
  { value: "all", label: "All Types" },
  { value: "interview-experience", label: "Interview Experience" },
  { value: "discussion", label: "Discussion" },
  { value: "doubt", label: "Doubt" },
  { value: "others", label: "Others" },
]

const SORT_OPTIONS = [
  { value: "most-recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "most-upvoted", label: "Most Upvoted" },
]

const FilterBar = ({ filters, onFilterChange, companies, industries }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    onFilterChange({ [name]: value })
  }

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <h3>Filters</h3>
        <button className="toggle-filters-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className={`filter-options ${isExpanded ? "expanded" : ""}`}>
        <div className="filter-group">
          <label htmlFor="sort">Sort By</label>
          <select id="sort" name="sort" value={filters.sort} onChange={handleChange}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="postType">Post Type</label>
          <select id="postType" name="postType" value={filters.postType} onChange={handleChange}>
            {POST_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="company">Company</label>
          <select id="company" name="company" value={filters.company} onChange={handleChange}>
            <option value="all">All Companies</option>
            {companies.map((company) => (
              <option key={company._id} value={company.name}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="role">Position/Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={filters.role !== "all" ? filters.role : ""}
            onChange={(e) => onFilterChange({ role: e.target.value || "all" })}
            placeholder="Filter by role"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="domain">Industry/Domain</label>
          <select id="domain" name="domain" value={filters.domain} onChange={handleChange}>
            <option value="all">All Industries</option>
            {industries.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="reset-filters-btn"
          onClick={() =>
            onFilterChange({
              sort: "most-recent",
              postType: "all",
              company: "all",
              role: "all",
              domain: "all",
            })
          }
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}

export default FilterBar

