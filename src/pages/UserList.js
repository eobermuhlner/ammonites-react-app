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
    );
};

export default UserList;
