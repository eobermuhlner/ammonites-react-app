import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserById, updateUserById, changeUserPassword, addUserRole, removeUserRole, fetchAllRoles } from '../services/api';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { useTranslation } from 'react-i18next';

const EditUserForm = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        enabled: true,
        roles: []
    });
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, ready } = useTranslation();

    useEffect(() => {
        fetchUserById(id)
            .then((userData) => {
                setUser((prevUser) => ({ ...prevUser, ...userData, roles: userData.roles || [] }));
            })
            .catch((err) => setError(t('editUserForm.errorFetchUser', { error: err })));

        fetchAllRoles()
            .then((rolesData) => {
                setRoles(rolesData || []);
            })
            .catch((err) => setError(t('editUserForm.errorFetchRoles', { error: err })));
    }, [id, t]);

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
            .catch((err) => setError(t('editUserForm.errorUpdateUser', { error: err })));
    };

    const handleChangePassword = (newPassword) => {
        changeUserPassword(id, newPassword)
            .catch((err) => setError(t('editUserForm.errorUpdatePassword', { error: err })));
    };

    const handleAddRole = () => {
        if (selectedRole) {
            addUserRole(id, selectedRole)
                .then(() => setUser((prevUser) => ({ ...prevUser, roles: [...prevUser.roles, selectedRole] })))
                .catch((err) => setError(t('editUserForm.errorAddRole', { error: err })));
        }
    };

    const handleRemoveRole = (role) => {
        removeUserRole(id, role)
            .then(() => setUser((prevUser) => ({ ...prevUser, roles: prevUser.roles.filter(r => r !== role) })))
            .catch((err) => setError(t('editUserForm.errorRemoveRole', { error: err })));
    };

    const handleCancel = () => {
        navigate('/users');
    };

    if (!ready) return <div>{t('loading')}</div>;

    return (
        <div className="container mt-5">
            <h1>{t('editUserForm.title')}</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">{t('editUserForm.username')}</label>
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
                    <label className="form-label">{t('editUserForm.email')}</label>
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
                    <label className="form-label">{t('editUserForm.firstName')}</label>
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
                    <label className="form-label">{t('editUserForm.lastName')}</label>
                    <input
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="button" className="btn btn-secondary mb-3" onClick={() => setShowModal(true)}>
                    {t('editUserForm.changePassword')}
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
                        {t('editUserForm.enabled')}
                    </label>
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('editUserForm.roles')}</label>
                    <ul className="list-group mb-3">
                        {user.roles.map((role, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                {role}
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveRole(role)}>
                                    {t('editUserForm.removeRole')}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <select
                        className="form-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="">{t('editUserForm.selectRole')}</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                        ))}
                    </select>
                    <button type="button" className="btn btn-primary mt-2" onClick={handleAddRole}>
                        {t('editUserForm.addRole')}
                    </button>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">{t('editUserForm.save')}</button>
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>{t('editUserForm.cancel')}</button>
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
