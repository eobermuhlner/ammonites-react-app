import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchUserRoles } from './services/api';
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
import './i18n';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const getRoles = async () => {
                const userRoles = await fetchUserRoles();
                setRoles(userRoles);
            };
            getRoles();
        }
    }, [ isAuthenticated ]);

    const hasRole = (role) => roles && roles.includes(role);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Router>
                <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} hasRole={hasRole}/>
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
                                <PrivateRoute isAuthenticated={isAuthenticated} hasRole={hasRole} roleRequired="ADMIN">
                                    <DataImport />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} hasRole={hasRole} roleRequired="ADMIN">
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
        </Suspense>
    );
}

export default App;
