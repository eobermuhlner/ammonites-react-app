import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllUsers, deleteUserById } from '../services/api';
import { useTranslation } from 'react-i18next';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { t, ready } = useTranslation();

    useEffect(() => {
        fetchAllUsers().then(setUsers).catch(console.error);
    }, []);

    const handleDelete = (id) => {
        deleteUserById(id)
            .then(() => setUsers(users.filter(user => user.id !== id)))
            .catch(console.error);
    };

    if (!ready) return <div>{t('loading')}</div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">{t('userList.title')}</h1>
            <Link to="/users/new" className="btn btn-primary mb-3">{t('userList.createUser')}</Link>

            <div className="d-none d-lg-block">
                <table className="table">
                    <thead>
                    <tr>
                        <th>{t('userList.username')}</th>
                        <th>{t('userList.email')}</th>
                        <th>{t('userList.firstName')}</th>
                        <th>{t('userList.lastName')}</th>
                        <th>{t('userList.enabled')}</th>
                        <th>{t('userList.roles')}</th>
                        <th>{t('userList.actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.enabled ? t('userList.yes') : t('userList.no')}</td>
                            <td>{user.roles.join(', ')}</td>
                            <td>
                                <Link to={`/users/${user.id}`} className="btn btn-secondary btn-sm mr-2">{t('userList.edit')}</Link>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">{t('userList.delete')}</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="d-lg-none">
                {users.map(user => (
                    <div className="card mb-3" key={user.id}>
                        <div className="card-body">
                            <h5 className="card-title">{user.username}</h5>
                            <p className="card-text"><strong>{t('userList.email')}:</strong> {user.email}</p>
                            <p className="card-text"><strong>{t('userList.firstName')}:</strong> {user.firstName}</p>
                            <p className="card-text"><strong>{t('userList.lastName')}:</strong> {user.lastName}</p>
                            <p className="card-text"><strong>{t('userList.enabled')}:</strong> {user.enabled ? t('userList.yes') : t('userList.no')}</p>
                            <p className="card-text"><strong>{t('userList.roles')}:</strong> {user.roles.join(', ')}</p>
                            <div className="d-flex justify-content-between">
                                <Link to={`/users/${user.id}`} className="btn btn-secondary btn-sm">{t('userList.edit')}</Link>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">{t('userList.delete')}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
