// src/components/InterviewSummary.js
import React, { useState, useEffect } from 'react';
import './InterviewSummary.css';

const InterviewSummary = ({ interviewState, messages, resetInterview }) => {
  const [expanded, setExpanded] = useState({});
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    if (interviewState.scores) {
      // Calculate overall score based on available categories
      const scores = Object.values(interviewState.scores);
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      setOverallScore(Math.round(average * 10) / 10); // Round to 1 decimal place
    }
  }, [interviewState]);

  const toggleExpand = (index) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'excellent';
    if (score >= 6) return 'good';
    if (score >= 4) return 'average';
    return 'poor';
  };

  const downloadReport = () => {
    // Create content for the report
    let reportContent = `# Technical Interview Report\n\n`;
    reportContent += `## Overall Score: ${overallScore}/10\n\n`;
    
    reportContent += `## Detailed Scores\n`;
    if (interviewState.scores) {
      Object.entries(interviewState.scores).forEach(([category, score]) => {
        reportContent += `- ${category}: ${score}/10\n`;
      });
    }
    
    reportContent += `\n## Detailed Feedback\n`;
    if (interviewState.feedback) {
      reportContent += interviewState.feedback;
    }
    
    reportContent += `\n\n## Interview Transcript\n\n`;
    messages.forEach((message, index) => {
      if (message.agent) reportContent += `Interviewer: ${message.agent}\n\n`;
      if (message.user) reportContent += `Candidate: ${message.user}\n\n`;
    });
    
    // Create and trigger download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="interview-summary">
      <h2>Interview Summary</h2>
      
      <div className="overall-score">
        <h3>Overall Score</h3>
        <div className={`score-circle ${getScoreColor(overallScore)}`}>
          <span>{overallScore}</span>
          <small>/10</small>
        </div>
      </div>
      
      {interviewState.scores && (
        <div className="category-scores">
          <h3>Category Scores</h3>
          {Object.entries(interviewState.scores).map(([category, score], index) => (
            <div key={index} className="score-category">
              <div className="category-header">
                <h4>{category}</h4>
                <div className={`category-score ${getScoreColor(score)}`}>{score}/10</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {interviewState.feedback && (
        <div className="detailed-feedback">
          <h3>Detailed Feedback</h3>
          <div className="feedback-content">
            {interviewState.feedback}
          </div>
        </div>
      )}
      
      <div className="interview-transcript">
        <h3>Interview Transcript</h3>
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`transcript-message ${expanded[index] ? 'expanded' : ''}`}
            onClick={() => toggleExpand(index)}
          >
            {message.agent && (
              <div className="transcript-agent">
                <strong>Interviewer:</strong> 
                {expanded[index] ? message.agent : `${message.agent.substring(0, 100)}${message.agent.length > 100 ? '...' : ''}`}
              </div>
            )}
            {message.user && (
              <div className="transcript-user">
                <strong>You:</strong> 
                {expanded[index] ? message.user : `${message.user.substring(0, 100)}${message.user.length > 100 ? '...' : ''}`}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="summary-actions">
        <button className="download-button" onClick={downloadReport}>
          Download Report
        </button>
        <button className="reset-button" onClick={resetInterview}>
          New Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewSummary;