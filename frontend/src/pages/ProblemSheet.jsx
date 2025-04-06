import React, { useState, useEffect } from 'react';
import './LeetcodeSheet.css';
import SideNavbar from '@/components/SideNavbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Custom hook for localStorage persistence
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const ProblemSheet = () => {
  // Use the custom hook instead of useState + useEffect for questions
  const [questions, setQuestions] = useLocalStorage('leetcodeQuestions', [
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      topic: 'Array',
      link: 'https://leetcode.com/problems/two-sum/',
      solution: 'https://www.youtube.com/watch?v=dRUpbt8vHpo',
      completed: false
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      topic: 'Stack',
      link: 'https://leetcode.com/problems/valid-parentheses/',
      solution: 'https://www.youtube.com/watch?v=WTzjTskDFMg',
      completed: false
    },
    {
      id: '3',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      topic: 'Linked List',
      link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
      solution: 'https://www.youtube.com/watch?v=XIdigk956u0',
      completed: false
    }
  ]);
  
  const [newQuestion, setNewQuestion] = useState({
    id: '',
    title: '',
    difficulty: 'Easy',
    topic: 'Array',
    link: '',
    solution: '',
    completed: false
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [filter, setFilter] = useState({ topic: 'All', difficulty: 'All' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("authToken");
  
      if (!authToken) {
        setError("Authentication token is missing");
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
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
  
        // Check for GitHub username
        if (data && data.user) {
          setUserData(data.user);
        }
  
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({ ...prev, [name]: value }));
  };

  const addQuestion = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing question
      setQuestions(questions.map(q => q.id === editingId ? { ...newQuestion, id: editingId } : q));
      setEditingId(null);
    } else {
      // Add new question
      const id = new Date().getTime().toString();
      setQuestions([...questions, { ...newQuestion, id }]);
    }
    
    // Reset form
    setNewQuestion({
      id: '',
      title: '',
      difficulty: 'Easy',
      topic: 'Array',
      link: '',
      solution: '',
      completed: false
    });
    setShowForm(false);
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const editQuestion = (id) => {
    const questionToEdit = questions.find(q => q.id === id);
    setNewQuestion({ ...questionToEdit });
    setEditingId(id);
    setShowForm(true);
  };

  const toggleCompleted = (id) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, completed: !q.completed } : q
    ));
  };

  const filteredQuestions = questions.filter(q => {
    if (filter.topic !== 'All' && q.topic !== filter.topic) return false;
    if (filter.difficulty !== 'All' && q.difficulty !== filter.difficulty) return false;
    return true;
  });

  const topics = ['All', 'Array', 'String', 'Linked List', 'Binary Tree', 'Graph', 'Dynamic Programming', 'Stack', 'Queue', 'Heap', 'Backtracking', 'Greedy', 'Binary Search'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className='flex flex-col h-screen'>
        <SideNavbar user={userData} />
        <div className="leetcode-sheet">
        <div className="header">
            <h1>Personal Coding Problem List</h1>
            <p>Track, add, and manage problems from any platform — LeetCode, Codeforces, CodeChef, and beyond.</p>
            <div className="controls">
            <div className="filters">
                <div className="filter-group">
                <label>Topic:</label>
                <select 
                    value={filter.topic} 
                    onChange={(e) => setFilter({...filter, topic: e.target.value})}
                >
                    {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                    ))}
                </select>
                </div>
                <div className="filter-group">
                <label>Difficulty:</label>
                <select 
                    value={filter.difficulty} 
                    onChange={(e) => setFilter({...filter, difficulty: e.target.value})}
                >
                    {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                    ))}
                </select>
                </div>
            </div>
            <button 
                className="add-btn" 
                onClick={() => {
                setNewQuestion({
                    id: '',
                    title: '',
                    difficulty: 'Easy',
                    topic: 'Array',
                    link: '',
                    solution: '',
                    completed: false
                });
                setEditingId(null);
                setShowForm(!showForm);
                }}
            >
                {showForm ? 'Cancel' : 'Add Question'}
            </button>
            </div>
        </div>

        {showForm && (
            <div className="question-form">
            <h2>{editingId ? 'Edit Question' : 'Add New Question'}</h2>
            <form onSubmit={addQuestion}>
                <div className="form-group">
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={newQuestion.title}
                    onChange={handleInputChange}
                    required
                />
                </div>
                <div className="form-group">
                <label>Difficulty:</label>
                <select
                    name="difficulty"
                    value={newQuestion.difficulty}
                    onChange={handleInputChange}
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                </div>
                <div className="form-group">
                <label>Topic:</label>
                <select
                    name="topic"
                    value={newQuestion.topic}
                    onChange={handleInputChange}
                >
                    {topics.slice(1).map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                    ))}
                </select>
                </div>
                <div className="form-group">
                <label>Problem Link:</label>
                <input
                    type="url"
                    name="link"
                    value={newQuestion.link}
                    onChange={handleInputChange}
                    required
                />
                </div>
                <div className="form-group">
                <label>Solution Link:</label>
                <input
                    type="url"
                    name="solution"
                    value={newQuestion.solution}
                    onChange={handleInputChange}
                />
                </div>
                <button type="submit" className="submit-btn">
                {editingId ? 'Update Question' : 'Add Question'}
                </button>
            </form>
            </div>
        )}

        <div className="question-table">
            <table>
            <thead>
                <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Topic</th>
                <th>Links</th>
                </tr>
            </thead>
            <tbody>
                {filteredQuestions.map(question => (
                <tr key={question.id} className={question.completed ? 'completed' : ''}>
                    <td>
                    <input
                        type="checkbox"
                        checked={question.completed}
                        onChange={() => toggleCompleted(question.id)}
                    />
                    </td>
                    <td className="title">{question.title}</td>
                    <td className={`difficulty ${question.difficulty.toLowerCase()}`}>
                    {question.difficulty}
                    </td>
                    <td>{question.topic}</td>
                    <td className="links">
                    <a href={question.link} target="_blank" rel="noopener noreferrer" className="problem-link">
                        Problem
                    </a>
                    {question.solution && (
                        <a href={question.solution} target="_blank" rel="noopener noreferrer" className="solution-link">
                        Solution
                        </a>
                    )}
                    </td>
                    <td className="actions">
                    <button 
                        className="edit-btn" 
                        onClick={() => editQuestion(question.id)}
                    >
                        Edit
                    </button>
                    <button 
                        className="delete-btn" 
                        onClick={() => deleteQuestion(question.id)}
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </div>
  );
};

export default ProblemSheet;