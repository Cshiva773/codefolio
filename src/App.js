import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import CodingProfile from './components/dashboard/SideBar/Codingprofile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />  
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile-setup" element={<CodingProfile />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;