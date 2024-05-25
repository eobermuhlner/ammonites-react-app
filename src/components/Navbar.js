import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, setIsAuthenticated, hasRole }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Ammonite App</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/browse">Browse</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/search">Search</Link>
                                </li>
                                {hasRole('ADMIN') && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/import">Import</Link>
                                    </li>
                                )}
                                {hasRole('ADMIN') && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/users">Users</Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
