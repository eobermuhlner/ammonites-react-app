import React, { useState } from 'react';
import axios from 'axios';

function DataImport() {
    const [csvFile, setCsvFile] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [importType, setImportType] = useState('ammonites'); // default to "ammonites"

    const handleCsvFileChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    const handleImageFilesChange = (event) => {
        setImageFiles(event.target.files);
    };

    const handleImportTypeChange = (event) => {
        setImportType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', csvFile);
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images', imageFiles[i]);
        }

        const endpoint = importType === 'ammonites'
            ? 'http://localhost:8080/api/import/ammonites'
            : 'http://localhost:8080/api/import/ammonite/measurements';

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResponseMessage(response.data);
            setErrorMessage('');
        } catch (error) {
            setResponseMessage('');
            setErrorMessage(`${error.response ? error.response.data : error.message}`);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="csvFile">CSV or Excel File: </label>
                    <input
                        id="csvFile"
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleCsvFileChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imageFiles">Image Files:</label>
                    <input
                        id="imageFiles"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFilesChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="importType">Import Type:</label>
                    <select id="importType" value={importType} onChange={handleImportTypeChange} className="form-control">
                        <option value="ammonites">Ammonites</option>
                        <option value="ammoniteMeasurements">Ammonite Measurements</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Upload Files</button>
            </form>
            {responseMessage && <pre className="alert alert-success mt-3">{responseMessage}</pre>}
            {errorMessage && <pre className="alert alert-danger mt-3">{errorMessage}</pre>}
        </div>
    );
}

export default DataImport;
