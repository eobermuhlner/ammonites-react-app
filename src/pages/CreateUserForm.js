import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserSelfOnboarding } from '../services/api';
import { useTranslation } from 'react-i18next';

const CreateUserForm = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        enabled: true
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

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
            setError(t('createUserForm.passwordsDoNotMatch'));
            return;
        }

        const userData = { ...user, password };
        createUserSelfOnboarding(userData)
            .then(() => navigate('/login'))
            .catch((err) => setError(t('createUserForm.errorCreateUser', { error: err })));
    };

    const handleCancel = () => {
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <h1>{t('createUserForm.title')}</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">{t('createUserForm.username')}</label>
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
                    <label className="form-label">{t('createUserForm.email')}</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('createUserForm.firstName')}</label>
                    <input
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('createUserForm.lastName')}</label>
                    <input
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('createUserForm.password')}</label>
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
                    <label className="form-label">{t('createUserForm.confirmPassword')}</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">{t('createUserForm.save')}</button>
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>{t('createUserForm.cancel')}</button>
                </div>
            </form>
        </div>
    );
};

export default CreateUserForm;
