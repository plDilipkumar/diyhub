import React, { useState } from 'react';
import axios from 'axios';

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
        <div>
            <h1>Upload Image for Repair Suggestions</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p>{message}</p>}
            {classification && <p>Classification: {classification}</p>}
            {repairGuide && (
                <div>
                    <h3>Repair Guide:</h3>
                    <p>{repairGuide}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
