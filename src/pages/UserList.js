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
            <ul className="list-group">
                {users.map(user => (
                    <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{user.username}</span>
                        <div>
                            <Link to={`/users/${user.id}`} className="btn btn-secondary btn-sm mr-2">Edit</Link>
                            <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
