// React example
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { confirmEmail } from '../services/api';

const ConfirmEmail = () => {
    const [status, setStatus] = useState('Confirming...');
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');

    useEffect(() => {
        confirmEmail(token)
            .then(() => {
                setStatus('Email confirmed successfully!');
            })
            .catch(() => {
                setStatus('Email confirmation failed.');
            });
    }, [token]);

    return (
        <div>
            <h1>Confirmation</h1>
            <h2>{status}</h2>
        </div>
    );
};

export default ConfirmEmail;
