import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AmmoniteBrowse from './pages/AmmoniteBrowse';
import AmmoniteSearch from './pages/AmmoniteSearch';
import AmmoniteViewer from './pages/AmmoniteViewer';
import DataImport from './pages/DataImport';
import Login from './pages/Login';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
      <Router>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <div className="container mt-3">
          <Routes>
            <Route path="/browse" element={<AmmoniteBrowse />} />
            <Route path="/search" element={<AmmoniteSearch />} />
            <Route path="/import" element={<DataImport />} />
            <Route path="/ammonite/:id" element={<AmmoniteViewer />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
