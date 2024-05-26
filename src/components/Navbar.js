import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Navbar({ isAuthenticated, setIsAuthenticated, hasRole }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">{t('navbar.brand')}</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/browse">{t('navbar.browse')}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/search">{t('navbar.search')}</Link>
                                </li>
                                {hasRole('ADMIN') && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/import">{t('navbar.import')}</Link>
                                    </li>
                                )}
                                {hasRole('ADMIN') && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/users">{t('navbar.users')}</Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button className="nav-link btn" onClick={handleLogout}>{t('navbar.logout')}</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">{t('navbar.login')}</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
