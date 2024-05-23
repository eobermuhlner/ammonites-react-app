import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserById, updateUserById, createUserSelfOnboarding } from '../services/api';
import ChangePasswordModal from '../components/ChangePasswordModal';

const UserForm = () => {
    const [user, setUser] = useState({ username: '', enabled: true });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchUserById(id)
                .then(setUser)
                .catch((err) => setError(`Failed to fetch user data: ${err}`));
        }
    }, [id]);

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

        if (!id && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const userData = { ...user };
        if (!id) {
            userData.password = password;
        }

        if (id) {
            updateUserById(id, userData)
                .then(() => navigate('/users'))
                .catch((err) => setError(`Failed to update user: ${err}`));
        } else {
            createUserSelfOnboarding(userData)
                .then(() => navigate('/login'))
                .catch((err) => setError(`Failed to create user: ${err}`));
        }
    };

    const handleChangePassword = (newPassword) => {
        const updatedUser = { ...user, password: newPassword };
        updateUserById(id, updatedUser)
            .then(() => navigate('/users'))
            .catch((err) => setError(`Failed to update password: ${err}`));
    };

    return (
        <div className="container mt-5">
            <h1>{id ? 'Edit User' : 'Create User'}</h1>
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
                {!id && (
                    <>
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
                    </>
                )}
                {id && (
                    <button type="button" className="btn btn-secondary mb-3" onClick={() => setShowModal(true)}>
                        Change Password
                    </button>
                )}
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
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
            <ChangePasswordModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleChangePassword={handleChangePassword}
            />
        </div>
    );
};

export default UserForm;
