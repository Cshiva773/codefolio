import React, { useState, useEffect, useRef } from 'react';
import ResumeUpload from './ResumeUpload';
import JobDescription from './JobDescription';
import ChatInterface from './ChatInterface';
import InterviewSummary from './InterviewSummary';
import LoadingSpinner from './LoadingSpinner';
import ResumeInput from './ResumeInput'; // Updated import
import './InterviewerApp.css';
import SideNavbar from '@/components/SideNavbar';
import Header from '@/components/Header';
const AiInterviewer = () => {
  const [step, setStep] = useState('setup'); // setup, interview, summary
  const [threadId, setThreadId] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeData, setResumeData] = useState('');
  const [interviewState, setInterviewState] = useState({});
  const [error, setError] = useState('');
  const [userData,setUserData]=useState(null);
  const [loading,setLoading]=useState(true);
  const eventSourceRef = useRef(null);


  useEffect(() => {
      const fetchUserProfile = async () => {
        const authToken = localStorage.getItem("authToken");
  
        if (!authToken) {
          setError("Authentication token is missing");
          setLoading(false);
          return;
        }
  
        try {
          const response = await fetch("https://codefolio-4.onrender.com/api/user/profile", {
            method: 'GET',
            credentials: 'include',
            headers: {
              "Authorization": `Bearer ${authToken}`,
              "Content-Type": "application/json"
            },
          });
  
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
  
          const data = await response.json();
  
          // Check for leetcode username
          if (data && data.user) {
            if (data.user.leetcode) {
              setUserData(data.user)
            } else if (data.user.socialLinks && data.user.socialLinks.leetcode) {
              setUserData(data.user)
            } else {
              setError("No LeetCode username found in profile");
              setLoading(false);
            }
          } else {
            setError("Unable to retrieve user profile data");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setError("Failed to fetch user profile");
          setLoading(false);
        }
      };
  
      fetchUserProfile();
    }, []);
  // Generate a unique thread ID

  
  useEffect(() => {
    if (!threadId) {
      setThreadId(`thread-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    }
  }, [threadId]);

  const startInterview = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }
    if (!resumeData) {
      setError('Please enter your resume information');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Prepare the payload exactly as shown in your Postman example
      const payload = {
        job_description: jobDescription,
        resume: resumeData,
        thread_id: threadId,
      };
      
      console.log("Sending payload:", payload);
      
      const response = await fetch('http://localhost:8000/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Once the interview is started, establish SSE connection
      connectToEventStream();
      setStep('interview');
    } catch (err) {
      console.error("Interview start error:", err);
      setError(`Failed to start interview: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  const connectToEventStream = () => {
    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(`http://localhost:8000/stream?thread_id=${threadId}`);
    
    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        // Stream completed
        eventSource.close();
        fetchInterviewState();
        return;
      }
      
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'token') {
          // Handle streaming tokens
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            const lastMessage = newMessages[newMessages.length - 1];
            
            if (lastMessage && lastMessage.agent && !lastMessage.user) {
              // Append to the last agent message
              lastMessage.agent += data.content;
              return newMessages;
            } else {
              // Create a new agent message
              return [...prevMessages, { agent: data.content, user: '' }];
            }
          });
        } else if (data.type === 'message') {
          // Handle complete messages
          setMessages(prevMessages => [...prevMessages, { agent: data.content, user: '' }]);
        }
      } catch (error) {
        console.error('Error parsing event data:', error, event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
      setError('Connection to interview server lost');
    };

    eventSourceRef.current = eventSource;
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Optimistically update UI with user message
    setMessages(prevMessages => {
      const newMessages = [...prevMessages];
      const lastMessage = newMessages[newMessages.length - 1];
      
      if (lastMessage && !lastMessage.user && lastMessage.agent) {
        // Complete the last message pair
        lastMessage.user = message;
        return newMessages;
      } else {
        // Create a new message pair
        return [...prevMessages, { agent: '', user: message }];
      }
    });

    try {
      const response = await fetch(`http://localhost:8000/stream?thread_id=${threadId}&message=${encodeURIComponent(message)}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // The response will be handled by the SSE connection
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
    }
  };

  const fetchInterviewState = async () => {
    try {
      const response = await fetch(`http://localhost:8000/state?thread_id=${threadId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInterviewState(data);
      
      // Check if interview is complete
      if (data.status === 'completed') {
        setStep('summary');
        console.log(data);
        // Close SSE connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      }
    } catch (err) {
      console.error('Failed to fetch interview state:', err);
    }
  };

  // Periodically fetch interview state
  useEffect(() => {
    if (step === 'interview') {
      const intervalId = setInterval(fetchInterviewState, 5000);
      return () => clearInterval(intervalId);
    }
  }, [step]);
  // Clean up event source on unmount
  

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const resetInterview = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setStep('setup');
    setMessages([]);
    setInterviewState({});
    setThreadId(`thread-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    setError('');
  };

  return (
    <>
      <Header />
      <div className="app-container">
        <div className="sidebar">
          <SideNavbar user={userData}/>
        </div>
        <div className="main-content">
          <div className="interviewer-app">
            <header>
              <h1>AI Technical Interviewer</h1>
            </header>

            {error && <div className="error-message">{error}</div>}

            {isLoading && <LoadingSpinner />}

            {step === 'setup' && (
              <div className="setup-container">
                <JobDescription 
                  jobDescription={jobDescription} 
                  setJobDescription={setJobDescription} 
                />
                <ResumeInput 
                  setResumeData={setResumeData} 
                />
                <button 
                  className="start-button" 
                  onClick={startInterview}
                  disabled={isLoading}
                >
                  Start Interview
                </button>
              </div>
            )}

            {step === 'interview' && (
              <ChatInterface 
                messages={messages} 
                sendMessage={sendMessage} 
                interviewState={interviewState}
              />
            )}

            {step === 'summary' && (
              <InterviewSummary 
                interviewState={interviewState} 
                messages={messages}
                resetInterview={resetInterview} 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AiInterviewer;