import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AmmoniteBrowse from './pages/AmmoniteBrowse';
import AmmoniteSearch from './pages/AmmoniteSearch';
import AmmoniteViewer from './pages/AmmoniteViewer';
import DataImport from './pages/DataImport';
import UserList from './pages/UserList';
import CreateUserForm from './pages/CreateUserForm';
import EditUserForm from './pages/EditUserForm';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

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
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route
                        path="/browse"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <AmmoniteBrowse />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <AmmoniteSearch />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/import"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <DataImport />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <UserList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/users/new"
                        element={<CreateUserForm />}
                    />
                    <Route
                        path="/users/:id"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <EditUserForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/ammonite/:id"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <AmmoniteViewer />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
