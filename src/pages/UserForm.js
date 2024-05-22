import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUserSelfOnboarding, fetchUserById, updateUserById } from '../services/api';

const UserForm = () => {
    const [user, setUser] = useState({ username: '', password: '', enabled: true });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchUserById(id).then(setUser).catch(console.error);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            updateUserById(id, user)
                .then(() => navigate('/users'))
                .catch(console.error);
        } else {
            createUserSelfOnboarding(user)  // Pass id only if updating
                .then(() => navigate('/login'))
                .catch(console.error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>{id ? 'Edit User' : 'Create User'}</h1>
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
                        value={user.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        </div>
    );
};

export default UserForm;
