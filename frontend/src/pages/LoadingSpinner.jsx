// src/components/LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner">
        <div className="spinner-inner"></div>
      </div>
      <p>Initializing interview...</p>
    </div>
  );
};

export default LoadingSpinner;