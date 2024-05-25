import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated, hasRole, roleRequired }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    if (roleRequired && !hasRole(roleRequired)) {
        return <Navigate to="/" />;
    }
    return children;
};

export default PrivateRoute;
