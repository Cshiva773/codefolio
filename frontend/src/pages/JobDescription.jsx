// src/components/JobDescription.js
import React from 'react';
import './JobDescription.css';

const JobDescription = ({ jobDescription, setJobDescription }) => {
  return (
    <div className="job-description">
      <h2>Job Description</h2>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter the job description here. Include required skills, experience level, and responsibilities."
        rows={6}
      />
    </div>
  );
};

export default JobDescription;