import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { postImportFile, extractErrorMessage } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

function DataImport() {
    const [csvFile, setCsvFile] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const handleCsvFileChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    const handleImageFilesChange = (event) => {
        setImageFiles(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', csvFile);
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images', imageFiles[i]);
        }

        setResponseMessage('');
        setError('');
        try {
            const response = await postImportFile(formData);
            setResponseMessage(response);
        } catch (error) {
            setError(t('dataImport.errorImportFailed', { error: extractErrorMessage(error) }))
        }
    };

    return (
        <div className="container">
            <h1>{t('dataImport.title')}</h1>
            <ErrorAlert error={error} />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="csvFile">{t('dataImport.csvFile')}</label>
                    <input
                        id="csvFile"
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleCsvFileChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imageFiles">{t('dataImport.imageFiles')}</label>
                    <input
                        id="imageFiles"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFilesChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">{t('dataImport.uploadFiles')}</button>
            </form>
            {responseMessage && <pre className="alert alert-success mt-3">{responseMessage}</pre>}
        </div>
    );
}

export default DataImport;
