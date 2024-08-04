import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoutes from './PrivateRoutes';

function App() {
  return (
    <Router>
      <Routes>
      <Route element={<PrivateRoutes />}>
            {" "}
          <Route path="/dashboard" element={<Dashboard />} />  
        </Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;