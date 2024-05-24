import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserSelfOnboarding } from '../services/api';

const CreateUserForm = () => {
    const [user, setUser] = useState({ username: '', enabled: true });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const userData = { ...user, password };
        createUserSelfOnboarding(userData)
            .then(() => navigate('/login'))
            .catch((err) => setError(`Failed to create user: ${err}`));
    };

    const handleCancel = () => {
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <h1>Create User</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        name="enabled"
                        checked={user.enabled}
                        onChange={(e) => setUser({ ...user, enabled: e.target.checked })}
                        className="form-check-input"
                        id="enabledCheck"
                    />
                    <label className="form-check-label" htmlFor="enabledCheck">
                        Enabled
                    </label>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CreateUserForm;
