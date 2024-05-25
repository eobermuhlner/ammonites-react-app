import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllUsers, deleteUserById } from '../services/api';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchAllUsers().then(setUsers).catch(console.error);
    }, []);

    const handleDelete = (id) => {
        deleteUserById(id)
            .then(() => setUsers(users.filter(user => user.id !== id)))
            .catch(console.error);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">User List</h1>
            <Link to="/users/new" className="btn btn-primary mb-3">Create User</Link>
            <table className="table">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Enabled</th>
                    <th>Roles</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.enabled ? 'Yes' : 'No'}</td>
                        <td>{user.roles.join(', ')}</td>
                        <td>
                            <Link to={`/users/${user.id}`} className="btn btn-secondary btn-sm mr-2">Edit</Link>
                            <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
