import React, { useState } from 'react';
import './ResumeUpload.css';

const ResumeUpload = ({ setResumeData }) => {
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // Added state for tracking processing progress
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file) => {
    setFileName(file.name);
    setUploadStatus('Processing...');
    setProcessingProgress(0);
    
    try {
      // Get text content from file
      let textContent = '';
      
      // Check if it's a PDF
      if (file.type === 'application/pdf') {
        // For PDF files, we use FileReader to get the raw data
        const reader = new FileReader();
        
        // Create a Promise to handle the async FileReader
        const readResult = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error('Error reading file'));
          reader.readAsDataURL(file);
        });
        
        // Convert PDF to text (you'll need to implement this)
        // This is a placeholder - you might need a PDF.js library
        textContent = readResult;
      } 
      // Handle text files directly
      else if (file.type === 'text/plain' || 
               file.type === 'application/msword' || 
               file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        textContent = await file.text();
      } 
      else {
        setUploadStatus('Unsupported file format. Please use PDF, DOC, DOCX, or TXT');
        return;
      }

      // Break the content into chunks (approximately 4000 tokens per chunk)
      // A rough estimate is about 4 characters per token
      const chunkSize = 16000; // ~4000 tokens
      const chunks = [];
      
      for (let i = 0; i < textContent.length; i += chunkSize) {
        chunks.push(textContent.slice(i, i + chunkSize));
      }
      
      console.log(`File split into ${chunks.length} chunks`);
      
      // Process each chunk sequentially
      const processedChunks = [];
      
      for (let i = 0; i < chunks.length; i++) {
        // Update progress
        setProcessingProgress(Math.floor((i / chunks.length) * 100));
        
        // Process this chunk (encode to base64)
        const base64Chunk = btoa(chunks[i]);
        
        // Call AI model with this chunk
        // This is where you'd integrate with your AI service
        // const aiResult = await callAIModel(base64Chunk);
        
        // For now, we'll just store the encoded chunk
        processedChunks.push(base64Chunk);
      }
      
      // Combine results if needed
      setResumeData(processedChunks);
      setProcessingProgress(100);
      setUploadStatus('Resume processed successfully');
      
    } catch (error) {
      console.error('File processing error:', error);
      setUploadStatus('Error processing file: ' + error.message);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="resume-upload">
      <h2>Upload Resume</h2>
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="resume" 
          onChange={handleFileChange} 
          accept=".pdf,.doc,.docx,.txt" 
          className="file-input"
        />
        <label htmlFor="resume" className="file-label">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
          </svg>
          {fileName ? `Selected: ${fileName}` : 'Choose or drop a file'}
        </label>
      </div>
      
      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.includes('Error') ? 'error' : 'success'}`}>
          {uploadStatus}
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
      
      <p className="file-info">Supported formats: PDF, DOC, DOCX, TXT</p>
    </div>
  );
};

export default ResumeUpload;