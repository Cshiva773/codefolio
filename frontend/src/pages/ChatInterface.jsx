import React, { useState, useEffect, useRef } from 'react';
import './ChatInterface.css';

const ChatInterface = ({ messages, sendMessage, interviewState }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      sendMessage(currentMessage);
      setCurrentMessage('');
    }
  };

  // Extract the text content safely from a message object or string
  const extractMessageContent = (messageObj) => {
    if (!messageObj) return '';
    
    // If it's already a string, return it
    if (typeof messageObj === 'string') return messageObj;
    
    // If it has a content property, use that
    if (messageObj.content) {
      // If content is a string, return it
      if (typeof messageObj.content === 'string') return messageObj.content;
      
      // If content is an array (like in some API responses), join the text parts
      if (Array.isArray(messageObj.content)) {
        return messageObj.content
          .map(item => {
            if (typeof item === 'string') return item;
            return item.text || '';
          })
          .join(' ');
      }
    }
    
    // As a fallback, convert the object to a string but avoid [object Object]
    return JSON.stringify(messageObj);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Technical Interview</h2>
        {interviewState.status && (
          <div className="interview-status">
            Status: {interviewState.status}
          </div>
        )}
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message-pair">
            {msg.agent && (
              <div className="message agent-message">
                <div className="message-avatar">AI</div>
                <div className="message-content">
                  {extractMessageContent(msg.agent)}
                </div>
              </div>
            )}
            
            {msg.user && (
              <div className="message user-message">
                <div className="message-content">
                  {extractMessageContent(msg.user)}
                </div>
                <div className="message-avatar">You</div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your answer..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;