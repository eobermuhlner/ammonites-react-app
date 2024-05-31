import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {fetchAllUsers, deleteUserById, extractErrorMessage} from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const { t, ready } = useTranslation();

    useEffect(() => {
        fetchAllUsers()
            .then(setUsers)
            .catch(error => {
                setError(t('userList.errorFetchAllUsers', { error: extractErrorMessage(error) }))
            });
    }, []);

    const handleDelete = (id) => {
        deleteUserById(id)
            .then(() => setUsers(users.filter(user => user.id !== id)))
            .catch(error => {
                setError(t('userList.errorDeleteUser', { error: extractErrorMessage(error) }))
            });
    };

    if (!ready) return <div>{t('loading')}</div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">{t('userList.title')}</h1>
            <ErrorAlert error={error} />
            <Link to="/users/new" className="btn btn-primary mb-3">{t('userList.createUser')}</Link>
            <table className="table">
                <thead>
                <tr>
                    <th>{t('entity.user.username')}</th>
                    <th>{t('entity.user.email')}</th>
                    <th>{t('entity.user.firstName')}</th>
                    <th>{t('entity.user.lastName')}</th>
                    <th>{t('entity.user.enabled')}</th>
                    <th>{t('entity.user.roles')}</th>
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
