import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
            navigate('/browse');
        } catch (error) {
            // Handle login error
            console.error('Login failed', error);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = '/oauth2/authorization/google';
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
}

export default Login;
