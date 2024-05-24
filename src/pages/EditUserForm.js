import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserById, updateUserById, changeUserPassword } from '../services/api';
import ChangePasswordModal from '../components/ChangePasswordModal';

const EditUserForm = () => {
    const [user, setUser] = useState({ username: '', enabled: true });
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserById(id)
            .then(setUser)
            .catch((err) => setError(`Failed to fetch user data: ${err}`));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        const updatedUser = { ...user };
        delete updatedUser.password;  // Ensure password is not sent in the user update

        updateUserById(id, updatedUser)
            .then(() => navigate('/users'))
            .catch((err) => setError(`Failed to update user: ${err}`));
    };

    const handleChangePassword = (newPassword) => {
        changeUserPassword(id, newPassword)
            .catch((err) => setError(`Failed to update password: ${err}`));
    };

    const handleCancel = () => {
        navigate('/users');
    };

    return (
        <div className="container mt-5">
            <h1>Edit User</h1>
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
                <button type="button" className="btn btn-secondary mb-3" onClick={() => setShowModal(true)}>
                    Change Password
                </button>
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
            <ChangePasswordModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleChangePassword={handleChangePassword}
            />
        </div>
    );
};

export default EditUserForm;
