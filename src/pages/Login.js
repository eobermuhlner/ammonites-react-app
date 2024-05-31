import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorAlert from '../components/ErrorAlert';

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t, ready } = useTranslation();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/login', {
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Handle successful login
            console.log('Login successful', response.data);
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            navigate('/browse');
        } catch (error) {
            // Handle login error
            console.error('Login failed', error);
            setError('Login failed. Please check your username and password.');
        }
    };

    if (!ready) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">{t('login.title')}</h2>
                            <ErrorAlert error={error} />
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                            <button className="btn btn-secondary w-100 mt-3" onClick={() => navigate('/users/me/new')}>
                                Create New User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
