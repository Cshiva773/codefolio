import React, { useState } from 'react';
import './ResumeInput.css';

const ResumeInput = ({ setResumeData }) => {
  const [skills, setSkills] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [education, setEducation] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessingStatus('Processing...');
    setProcessingProgress(25);
    
    try {
      // Combine all resume data into a simple string format
      // Based on your Postman example, the API expects a simple string
      const resumeText = `${skills}, ${workExperience}, ${education}`.trim();
      
      console.log("Resume text to send to API:", resumeText);
      
      // Simply pass the string directly to the parent component
      setResumeData(resumeText);
      
      setProcessingProgress(100);
      setProcessingStatus('Resume processed successfully');
      
    } catch (error) {
      console.error('Data processing error:', error);
      setProcessingStatus('Error processing data: ' + error.message);
    }
  };

  return (
    <div className="resume-input">
      <h2>Enter Resume Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="skills">Skills</label>
          <textarea
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Enter your technical skills (e.g., JavaScript, React, Node.js, Python)"
            rows={4}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="workExperience">Work Experience</label>
          <textarea
            id="workExperience"
            value={workExperience}
            onChange={(e) => setWorkExperience(e.target.value)}
            placeholder="Enter your work experience (include company, title, dates, and responsibilities)"
            rows={6}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="education">Education</label>
          <textarea
            id="education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="Enter your educational background"
            rows={3}
          />
        </div>
        
        <button type="submit" className="submit-button">Process Resume Data</button>
      </form>
      
      {processingStatus && (
        <div className={`processing-status ${processingStatus.includes('Error') ? 'error' : 'success'}`}>
          {processingStatus}
        </div>
      )}
      
      {processingProgress > 0 && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${processingProgress}%` }}
          ></div>
          <span>{processingProgress}%</span>
        </div>
      )}
    </div>
  );
};

export default ResumeInput;