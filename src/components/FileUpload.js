import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; // Importing the CSS file

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [classification, setClassification] = useState('');
    const [repairGuide, setRepairGuide] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage(response.data.message);
            setClassification(response.data.classification || '');
            setRepairGuide(response.data.repairGuide || '');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error uploading file';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="file-upload-container">
            <h1 className="file-upload-heading">Upload Image for Repair Suggestions</h1>
            <input type="file" onChange={handleFileChange} className="file-upload-input" />
            <button onClick={handleUpload} disabled={loading} className={`file-upload-button ${loading ? 'loading' : ''}`}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p className="file-upload-message">{message}</p>}
            {classification && <p className="file-upload-classification">Classification: <strong>{classification}</strong></p>}
            {repairGuide && (
                <div className="file-upload-repair-guide">
                    <h3>Repair Guide:</h3>
                    <p>{repairGuide}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
