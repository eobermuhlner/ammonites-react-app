import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ChangePasswordModal = ({ show, handleClose, handleChangePassword }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(t('changePasswordModal.passwordsDoNotMatch'));
            return;
        }
        handleChangePassword(newPassword);
        handleClose();
    };

    const handleCancel = () => {
        handleClose();
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{t('changePasswordModal.title')}</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">{t('changePasswordModal.newPassword')}</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{t('changePasswordModal.confirmPassword')}</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">{t('changePasswordModal.save')}</button>
                                <button type="button" className="btn btn-danger" onClick={handleCancel}>{t('changePasswordModal.cancel')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
