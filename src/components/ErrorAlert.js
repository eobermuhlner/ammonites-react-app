import React from 'react';
import PropTypes from 'prop-types';

const ErrorAlert = ({ error }) => {
    if (!error) return null;

    return (
        <div className="alert alert-danger" role="alert">
            {error}
        </div>
    );
};

ErrorAlert.propTypes = {
    error: PropTypes.string
};

export default ErrorAlert;
